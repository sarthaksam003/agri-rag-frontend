import styles from "./LanguageSelector.module.css";

export const LanguageSelector = () => {
    return (
        <div className={styles["dropdown"]}>
            <button className={styles["langTrigger"]} aria-expanded="false" aria-haspopup="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span  >EN text · EN voice</span>
                <svg className="chev" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            <div className={styles["menu"]}>
                {/* <div className="menu-label">Text language</div>
                <button className="menu-item selected"  ><span className="mi-main">English</span></button> */}
                {/* <button className="menu-item"  ><span className="mi-main">Odia</span></button>
                <button className="menu-item"  ><span className="mi-main">Hindi</span></button>
                <button className="menu-item"  ><span className="mi-main">Punjabi</span></button>
                <button className="menu-item"  ><span className="mi-main">Tamil</span></button> */}
                <div className={styles["menu-divider"]}></div>
                {/* <div className="menu-label">Voice language</div>
                <button className="menu-item selected"  ><span className="mi-main">English</span></button> */}
                {/* <button className="menu-item"  ><span className="mi-main">Odia</span></button>
                <button className="menu-item"  ><span className="mi-main">Hindi</span></button>
                <button className="menu-item"  ><span className="mi-main">Punjabi</span></button>
                <button className="menu-item"  ><span className="mi-main">Tamil</span></button> */}
            </div>
        </div>

    )
}
