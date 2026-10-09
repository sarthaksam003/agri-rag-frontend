import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getRagConfiguration,
  updateRagConfiguration,
  type RagConfigurationResponse,
} from "@/services/apiClient";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useTranslation } from "@/features/localization/useTranslation";
import { cropAvatarDataUrl, sanitizeAvatarFile } from "@/features/settings/utils/avatar";
import UserAvatar from "@/shared/components/ui/UserAvatar";
import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdUpload } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/apiAuth";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/shared/components/hooks/useToast";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const {
    profileName,
    occupation,
    setProfileName,
    setOccupation,
  } = useSettingsStore();
  const { t } = useTranslation();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const displayPicture = user?.profile_picture ?? null;
  const [ragConfig, setRagConfig] =
    useState<RagConfigurationResponse | null>(null);
  const [draftRagMode, setDraftRagMode] =
    useState<RagConfigurationResponse["rag_mode"]>("simple");
  const [draftMaxQueries, setDraftMaxQueries] = useState(2);
  const [isRagLoading, setIsRagLoading] = useState(false);
  const [isRagSaving, setIsRagSaving] = useState(false);
  const [ragError, setRagError] = useState<string | null>(null);

  const [draftName, setDraftName] = useState(profileName);
  const [draftOccupation, setDraftOccupation] = useState(occupation);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user?.is_superuser) {
      return;
    }

    let cancelled = false;

    const loadRagConfiguration = async () => {
      try {
        setIsRagLoading(true);
        setRagError(null);

        const configuration = await getRagConfiguration();

        if (cancelled) {
          return;
        }

        setRagConfig(configuration);
        setDraftRagMode(configuration.rag_mode);
        setDraftMaxQueries(configuration.max_queries);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setRagError(
          error instanceof Error
            ? error.message
            : "Could not load RAG configuration.",
        );
      } finally {
        if (!cancelled) {
          setIsRagLoading(false);
        }
      }
    };

    void loadRagConfiguration();

    return () => {
      cancelled = true;
    };
  }, [user?.is_superuser]);

  const handleSaveRagConfiguration = async () => {
    try {
      setIsRagSaving(true);
      setRagError(null);

      const updatedConfiguration = await updateRagConfiguration(
        draftRagMode,
        draftMaxQueries,
      );

      setRagConfig(updatedConfiguration);
      setDraftRagMode(updatedConfiguration.rag_mode);
      setDraftMaxQueries(updatedConfiguration.max_queries);
      showToast(t("notifications.ragConfigurationSaved"), {
        type: "success",
      });
    } catch (error) {
      setRagError(
        error instanceof Error
          ? error.message
          : "Could not update RAG configuration.",
      );
      showToast(t("notifications.ragConfigurationSaveFailed"), {
        type: "error",
      });
    } finally {
      setIsRagSaving(false);
    }
  };

  const handleCancelRagConfiguration = () => {
    if (!ragConfig) {
      return;
    }

    setDraftRagMode(ragConfig.rag_mode);
    setDraftMaxQueries(ragConfig.max_queries);
  };

  const isRagConfigDirty =
    ragConfig !== null &&
    (draftRagMode !== ragConfig.rag_mode ||
      draftMaxQueries !== ragConfig.max_queries);

  // const handleMaxQueriesChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setMaxQueries(Number(event.target.value));
  // };

  const handleSelectImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const sanitizedSource = await sanitizeAvatarFile(file);
      setSelectedImage(sanitizedSource);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The selected image could not be processed.",
      );
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const handleCropSave = async () => {
    if (!selectedImage) {
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const croppedImage = await cropAvatarDataUrl(
        selectedImage,
        zoom,
        offsetX,
        offsetY,
      );

      const updatedUser = await authApi.updateProfilePicture(
        croppedImage,
      );

      queryClient.setQueryData(
        AUTH_QUERY_KEY,
        updatedUser,
      );
      showToast(t("notifications.profilePictureUpdated"), {
        type: "success",
      });
      setSelectedImage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not save the selected image.",
      );
      showToast(t("notifications.profilePictureUpdateFailed"), {
        type: "error",
      });

    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const updatedUser =
        await authApi.updateProfilePicture(null);

      queryClient.setQueryData(
        AUTH_QUERY_KEY,
        updatedUser,
      );
      showToast(t("notifications.profilePictureRemoved"), {
        type: "success",
      });
      setSelectedImage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not remove the profile picture.",
      );
      showToast(t("notifications.profilePictureRemoveFailed"), {
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProfile = () => {
    setProfileName(draftName.trim());
    setOccupation(draftOccupation.trim());

    showToast(t("notifications.profileSaved"), {
      type: "success",
    });
  };

  const handleCancelProfile = () => {
    setDraftName(profileName);
    setDraftOccupation(occupation);
  };

  const isProfileDirty =
    draftName !== profileName || draftOccupation !== occupation;
  const hasCustomDisplayPicture = Boolean(displayPicture);

  return (
    <section className={styles.view} >
      <div className={styles.page}>
        <div className={styles.pageInner}>
          <header className={styles.pageHeader}>
            <div className={styles.pageTitle}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-amber)"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>

              <span>{t("settings.title")}</span>
            </div>

            <div className={styles.pageSub}>
              {t("settings.description")}
            </div>
          </header>

          <div className={styles.settingsContent}>
            <section className={`${styles.settingsSection} ${styles.profileSection}`}>
              <h2 className={styles.sectionTitle}>
                {t("settings.profile")}
              </h2>

              <div className={styles.avatarEditorWrap}>
                <div className={styles.avatarCard}>
                  <div
                    className={styles.avatarHoverTarget}
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    aria-label={
                      displayPicture
                        ? t("settings.changePicture")
                        : t("settings.uploadPicture")
                    }
                  >
                    <UserAvatar
                      name={profileName}
                      avatarUrl={displayPicture}
                      size={205}
                      initialsSize="4rem"
                    />

                    <div className={styles.avatarOverlay}>
                      <button
                        type="button"
                        className={styles.overlayPrimaryButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        disabled={isProcessing}
                      >
                        <span className={styles.overlayIcon} aria-hidden="true">
                          {displayPicture ? <FaRegEdit /> : <MdUpload />}
                        </span>
                        {displayPicture ? t("settings.changePicture") : t("settings.uploadPicture")}
                      </button>

                      {hasCustomDisplayPicture && (
                        <button
                          type="button"
                          className={styles.overlaySecondaryButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemovePicture();
                          }}
                          disabled={isProcessing}
                        >
                          <span className={styles.overlayIcon} aria-hidden="true">
                            <IoMdClose />
                          </span>
                          {t("settings.removePicture")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleSelectImage}
                />

                {errorMessage && (
                  <div className={styles.errorMessage}>{errorMessage}</div>
                )}

              </div>

              <div className={styles.profileGrid}>
                <div className={styles.settingsField}>
                  <label
                    htmlFor="profileName"
                    className={styles.settingsLabel}
                  >
                    {t("settings.name")}
                  </label>

                  <input
                    id="profileName"
                    type="text"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder={t("settings.namePlaceholder")}
                    className={styles.settingsInput}
                  />
                </div>

                <div className={styles.settingsField}>
                  <label
                    htmlFor="occupation"
                    className={styles.settingsLabel}
                  >
                    {t("settings.occupation")}
                  </label>

                  <input
                    id="occupation"
                    type="text"
                    value={draftOccupation}
                    onChange={(event) =>
                      setDraftOccupation(event.target.value)
                    }
                    placeholder={t("settings.occupationPlaceholder")}
                    className={styles.settingsInput}
                  />
                </div>
              </div>

              <div className={styles.profileActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelProfile}
                  disabled={!isProfileDirty}
                >
                  {t("settings.cancel")}
                </button>

                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleSaveProfile}
                  disabled={!isProfileDirty}
                >
                  {t("settings.saveChanges")}
                </button>
              </div>
            </section>

            {user?.is_superuser && (
              <section className={styles.settingsSection}>
                <div className={styles.ragHeading}>
                  <h2 className={styles.sectionTitle}>
                    {t("settings.ragMode")}
                  </h2>

                  {ragConfig && (
                    <span className={styles.ragSelection}>
                      {ragConfig.rag_mode === "simple"
                        ? t("settings.simple")
                        : t("settings.selectedQueries", {
                          count: ragConfig.max_queries,
                        })}
                    </span>
                  )}
                </div>

                {isRagLoading ? (
                  <p>Loading RAG configuration...</p>
                ) : (
                  <>
                    <div className={styles.toggleGroup}>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${draftRagMode === "simple" ? styles.active : ""
                          }`}
                        onClick={() => setDraftRagMode("simple")}
                        aria-pressed={draftRagMode === "simple"}
                        disabled={isRagSaving}
                      >
                        {t("settings.simple")}
                      </button>

                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${draftRagMode === "multiquery" ? styles.active : ""
                          }`}
                        onClick={() => setDraftRagMode("multiquery")}
                        aria-pressed={draftRagMode === "multiquery"}
                        disabled={isRagSaving}
                      >
                        {t("settings.multiquery")}
                      </button>
                    </div>

                    {draftRagMode === "multiquery" && (
                      <div className={styles.queryField}>
                        <label
                          htmlFor="maxQueriesSlider"
                          className={styles.settingsLabel}
                        >
                          {t("settings.maxQueries", {
                            count: draftMaxQueries,
                          })}
                        </label>

                        <input
                          id="maxQueriesSlider"
                          type="range"
                          min="2"
                          max="6"
                          step="1"
                          value={draftMaxQueries}
                          onChange={(event) =>
                            setDraftMaxQueries(Number(event.target.value))
                          }
                          className={styles.settingsSlider}
                          disabled={isRagSaving}
                        />

                        <div className={styles.sliderLabels}>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                          <span>6</span>
                        </div>
                      </div>
                    )}

                    {ragError && (
                      <div className={styles.errorMessage}>
                        {ragError}
                      </div>
                    )}

                    <div className={styles.profileActions}>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleCancelRagConfiguration}
                        disabled={!isRagConfigDirty || isRagSaving}
                      >
                        {t("settings.cancel")}
                      </button>

                      <button
                        type="button"
                        className={styles.saveButton}
                        onClick={handleSaveRagConfiguration}
                        disabled={!isRagConfigDirty || isRagSaving}
                      >
                        {isRagSaving ? "Saving..." : t("settings.saveChanges")}
                      </button>
                    </div>
                  </>
                )}
              </section>
            )}          </div>

          <ConfirmationModal
            open={Boolean(selectedImage)}
            title="Adjust picture"
            message={
              selectedImage ? (
                <div className={styles.cropPanel}>
                  <div className={styles.cropPreviewFrame}>
                    <img
                      src={selectedImage}
                      alt="Selected avatar preview"
                      className={styles.cropPreviewImage}
                      style={{
                        transform: `translate(${offsetX * 0.7}%, ${offsetY * 0.7}%) scale(${zoom})`,
                      }}
                      draggable={false}
                      onContextMenu={(event) => event.preventDefault()}
                    />
                  </div>

                  <div className={styles.cropControlGroup}>
                    <label htmlFor="avatarZoom" className={styles.settingsLabel}>
                      Zoom
                    </label>
                    <input
                      id="avatarZoom"
                      type="range"
                      min="1"
                      max="3"
                      step="0.01"
                      value={zoom}
                      onChange={(event) => setZoom(Number(event.target.value))}
                      className={styles.settingsSlider}
                    />
                  </div>

                  <div className={styles.cropControlGroup}>
                    <label htmlFor="avatarOffsetX" className={styles.settingsLabel}>
                      Horizontal position
                    </label>
                    <input
                      id="avatarOffsetX"
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={offsetX}
                      onChange={(event) => setOffsetX(Number(event.target.value))}
                      className={styles.settingsSlider}
                    />
                  </div>

                  <div className={styles.cropControlGroup}>
                    <label htmlFor="avatarOffsetY" className={styles.settingsLabel}>
                      Vertical position
                    </label>
                    <input
                      id="avatarOffsetY"
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={offsetY}
                      onChange={(event) => setOffsetY(Number(event.target.value))}
                      className={styles.settingsSlider}
                    />
                  </div>
                </div>
              ) : undefined
            }
            confirmLabel={isProcessing ? "Saving..." : "Save picture"}
            cancelLabel="Cancel"
            onConfirm={handleCropSave}
            onCancel={() => setSelectedImage(null)}
            isLoading={isProcessing}
          />
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;