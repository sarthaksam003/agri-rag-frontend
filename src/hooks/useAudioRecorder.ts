import { useCallback, useRef, useState } from "react";

const TARGET_SAMPLE_RATE = 16000;

const audioBufferToWav = (
  audioBuffer: AudioBuffer,
): ArrayBuffer => {
  const channelData = audioBuffer.getChannelData(0);
  const bytesPerSample = 2;
  const dataLength = channelData.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  const writeString = (
    offset: number,
    value: string,
  ) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");

  // fmt chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(
    24,
    TARGET_SAMPLE_RATE,
    true,
  );
  view.setUint32(
    28,
    TARGET_SAMPLE_RATE * bytesPerSample,
    true,
  );
  view.setUint16(
    32,
    bytesPerSample,
    true,
  );
  view.setUint16(34, 16, true); // 16-bit PCM

  // data chunk
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  // PCM samples
  let offset = 44;

  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(
      -1,
      Math.min(1, channelData[i]),
    );

    const pcmSample =
      sample < 0
        ? sample * 0x8000
        : sample * 0x7fff;

    view.setInt16(
      offset,
      pcmSample,
      true,
    );

    offset += 2;
  }

  return buffer;
};

const convertToWav16k = async (
  inputBlob: Blob,
): Promise<Blob> => {
  const arrayBuffer = await inputBlob.arrayBuffer();

  const audioContext = new AudioContext();

  try {
    const decodedBuffer =
      await audioContext.decodeAudioData(
        arrayBuffer,
      );

    /*
     * Render the decoded audio into a new
     * mono 16 kHz AudioBuffer.
     */
    const targetLength = Math.ceil(
      decodedBuffer.duration * TARGET_SAMPLE_RATE,
    );

    const offlineContext =
      new OfflineAudioContext(
        1,
        targetLength,
        TARGET_SAMPLE_RATE,
      );

    const source =
      offlineContext.createBufferSource();

    source.buffer = decodedBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer =
      await offlineContext.startRendering();

    const wavBuffer =
      audioBufferToWav(renderedBuffer);

    return new Blob(
      [wavBuffer],
      {
        type: "audio/wav",
      },
    );
  } finally {
    await audioContext.close();
  }
};

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] =
    useState(false);

  const [duration, setDuration] =
    useState(0);

  const [audioLevel, setAudioLevel] =
    useState(0);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const streamRef =
    useRef<MediaStream | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserFrameRef =
    useRef<number | null>(null);

  const stopAudioLevelMeter =
    useCallback(() => {
      if (analyserFrameRef.current !== null) {
        cancelAnimationFrame(
          analyserFrameRef.current,
        );

        analyserFrameRef.current = null;
      }

      const audioContext =
        audioContextRef.current;

      audioContextRef.current = null;
      setAudioLevel(0);

      if (audioContext) {
        void audioContext.close();
      }
    }, []);

  const startAudioLevelMeter =
    useCallback((stream: MediaStream) => {
      stopAudioLevelMeter();

      const audioContext =
        new AudioContext();

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;

      const source =
        audioContext.createMediaStreamSource(stream);

      source.connect(analyser);

      const samples =
        new Uint8Array(analyser.fftSize);

      audioContextRef.current = audioContext;

      const updateLevel = () => {
        analyser.getByteTimeDomainData(samples);

        let sumSquares = 0;

        for (let i = 0; i < samples.length; i++) {
          const centeredSample =
            (samples[i] - 128) / 128;

          sumSquares +=
            centeredSample * centeredSample;
        }

        const rms =
          Math.sqrt(sumSquares / samples.length);

        setAudioLevel(
          Math.min(1, rms * 8),
        );

        analyserFrameRef.current =
          requestAnimationFrame(updateLevel);
      };

      updateLevel();
    }, [stopAudioLevelMeter]);

  const startRecording = useCallback(
    async (): Promise<boolean> => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true,
              },
            },
          );

        const track =
          stream.getAudioTracks()[0];

        console.log(
          "Microphone track settings:",
          track.getSettings(),
        );

        streamRef.current = stream;
        chunksRef.current = [];
        startAudioLevelMeter(stream);

        const mimeType =
          MediaRecorder.isTypeSupported(
            "audio/webm;codecs=opus",
          )
            ? "audio/webm;codecs=opus"
            : "audio/webm";

        const mediaRecorder =
          new MediaRecorder(stream, {
            mimeType,
          });

        mediaRecorder.ondataavailable =
          (event: BlobEvent) => {
            if (event.data.size > 0) {
              chunksRef.current.push(
                event.data,
              );
            }
          };

        mediaRecorderRef.current =
          mediaRecorder;

        mediaRecorder.start(100);

        setIsRecording(true);
        setDuration(0);

        timerRef.current = setInterval(() => {
          setDuration(
            (current) => current + 1,
          );
        }, 1000);

        return true;
      } catch (error) {
        stopAudioLevelMeter();

        console.error(
          "Microphone access denied:",
          error,
        );

        return false;
      }
    },
    [startAudioLevelMeter, stopAudioLevelMeter],
  );

  const stopRecording = useCallback(
    (): Promise<Blob | null> => {
      return new Promise<Blob | null>(
        (resolve, reject) => {
          const mediaRecorder =
            mediaRecorderRef.current;

          if (!mediaRecorder) {
            resolve(null);
            return;
          }

          mediaRecorder.onstop = async () => {
            try {
              const recordedBlob =
                chunksRef.current.length > 0
                  ? new Blob(
                      chunksRef.current,
                      {
                        type:
                          mediaRecorder.mimeType,
                      },
                    )
                  : null;

              chunksRef.current = [];

              if (streamRef.current) {
                streamRef.current
                  .getTracks()
                  .forEach(
                    (track) => track.stop(),
                  );

                streamRef.current = null;
              }

              mediaRecorderRef.current =
                null;

              if (!recordedBlob) {
                resolve(null);
                return;
              }

              console.log(
                "Recorded WebM:",
                recordedBlob.size,
                "bytes",
                recordedBlob.type,
              );

              const wavBlob =
                await convertToWav16k(
                  recordedBlob,
                );

              console.log(
                "Converted WAV:",
                wavBlob.size,
                "bytes",
                wavBlob.type,
              );

              resolve(wavBlob);
            } catch (error) {
              reject(error);
            }
          };

          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          stopAudioLevelMeter();
          setIsRecording(false);
          setDuration(0);

          mediaRecorder.stop();
        },
      );
    },
    [stopAudioLevelMeter],
  );

  const cancelRecording =
    useCallback(() => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );

        timerRef.current = null;
      }

      const mediaRecorder =
        mediaRecorderRef.current;

      if (
        mediaRecorder &&
        mediaRecorder.state !==
          "inactive"
      ) {
        mediaRecorder.stop();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) => track.stop(),
          );

        streamRef.current = null;
      }

      stopAudioLevelMeter();
      chunksRef.current = [];
      mediaRecorderRef.current = null;

      setIsRecording(false);
      setDuration(0);
    }, [stopAudioLevelMeter]);

  return {
    isRecording,
    duration,
    audioLevel,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
