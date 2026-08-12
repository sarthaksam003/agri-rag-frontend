import { useState } from "react";
import { useSettingsStore } from "@/features/settings/store/settings.store";

import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const {
    ragMode,
    maxQueries,
    profileName,
    occupation,
    setRagMode,
    setMaxQueries,
    setProfileName,
    setOccupation,
  } = useSettingsStore();

  /*
   * Profile values are intentionally kept as local draft state.
   * The Zustand store is updated only after the user clicks Save changes.
   */
  const [draftName, setDraftName] = useState(profileName);
  const [draftOccupation, setDraftOccupation] = useState(occupation);

  const handleMaxQueriesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMaxQueries(Number(event.target.value));
  };

  const handleSaveProfile = () => {
    setProfileName(draftName.trim());
    setOccupation(draftOccupation.trim());
  };

  const handleCancelProfile = () => {
    setDraftName(profileName);
    setDraftOccupation(occupation);
  };

  const isProfileDirty =
    draftName !== profileName || draftOccupation !== occupation;

  return (
    <section className={styles.view}>
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

              <span>Settings</span>
            </div>

            <div className={styles.pageSub}>
              Configuration for this workspace.
            </div>
          </header>

          <div className={styles.settingsContent}>
            {/* Profile */}
            <section className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Profile</h2>

              <div className={styles.profileGrid}>
                <div className={styles.settingsField}>
                  <label
                    htmlFor="profileName"
                    className={styles.settingsLabel}
                  >
                    Name
                  </label>

                  <input
                    id="profileName"
                    type="text"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    placeholder="Enter your name"
                    className={styles.settingsInput}
                  />
                </div>

                <div className={styles.settingsField}>
                  <label
                    htmlFor="occupation"
                    className={styles.settingsLabel}
                  >
                    Occupation
                  </label>

                  <input
                    id="occupation"
                    type="text"
                    value={draftOccupation}
                    onChange={(event) =>
                      setDraftOccupation(event.target.value)
                    }
                    placeholder="Enter your occupation"
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
                  Cancel
                </button>

                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleSaveProfile}
                  disabled={!isProfileDirty}
                >
                  Save changes
                </button>
              </div>
            </section>

            {/* RAG configuration */}
            <section className={styles.settingsSection}>
              <div className={styles.ragHeading}>
                <h2 className={styles.sectionTitle}>RAG Mode</h2>

                <span className={styles.ragSelection}>
                  {ragMode === "simple"
                    ? "Simple"
                    : `Multiquery · ${maxQueries} queries`}
                </span>
              </div>

              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    ragMode === "simple" ? styles.active : ""
                  }`}
                  onClick={() => setRagMode("simple")}
                  aria-pressed={ragMode === "simple"}
                >
                  Simple
                </button>

                <button
                  type="button"
                  className={`${styles.toggleBtn} ${
                    ragMode === "multi" ? styles.active : ""
                  }`}
                  onClick={() => setRagMode("multi")}
                  aria-pressed={ragMode === "multi"}
                >
                  Multiquery
                </button>
              </div>

              {ragMode === "multi" && (
                <div className={styles.queryField}>
                  <label
                    htmlFor="maxQueriesSlider"
                    className={styles.settingsLabel}
                  >
                    Max Queries: {maxQueries}
                  </label>

                  <input
                    id="maxQueriesSlider"
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={maxQueries}
                    onChange={handleMaxQueriesChange}
                    className={styles.settingsSlider}
                  />

                  <div className={styles.sliderLabels}>
                    <span>2</span>
                    <span>6</span>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;