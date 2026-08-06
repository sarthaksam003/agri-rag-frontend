import { useEffect } from "react";
import { useRecordingStore } from "@/features/voice/store/recording.store";

export function useIncrementRecordingTimer() {

    const isRecording = useRecordingStore(
        state => state.state == 'recording'
    );

    const tick = useRecordingStore(
        state => state.tick
    );

    useEffect(() => {

        if (!isRecording)
            return;

        const id = window.setInterval(() => {

            tick();

        }, 1000);

        return () => clearInterval(id);

    }, [isRecording, tick]);

}