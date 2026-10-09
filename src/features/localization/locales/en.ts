export const en = {
    navigation: {
        chat: "Chat",
        documents: "Documents",
        sessions: "Sessions",
        settings: "Settings",
    },

    actions: {
        newChat: "New Chat",
        send: "Send",
        resend: "Resend",
        edit: "Edit",
        listen: "Listen",
        stop: "Stop",
        stopGenerating: "Stop generating",
        copy: "Copy",
        copied: "Copied",
        attach: "Attach",
        showSources: "Show sources",
        confirm: "Confirm",
        cancel: "Cancel",
        logout: "Logout",
        delete: "Delete",
        deleteAll: "Delete all",
        refresh: "Refresh",
        download: "Download PDF",

    },

    common: {
        language: "Language",
        accessibilityOptions: "Accessibility Options",
        profileSettings: "Profile settings",
        loggingOut: "Logging out...",
        openSidebar: "Open Sidebar",
        closeSidebar: "Close Sidebar",
        toggleSourceInspector: "Toggle source inspector",
        sessionOptions: "Session options",
        closeConfirmationDialog: "Close confirmation dialog",
        pleaseWait: "Please wait...",
        loading: "Loading",
        documents: " Documents",
        sessions: "Sessions",
        chat: "Chat",
        settings: "Settings"
    },
    login: {
        ragPowered: "RAG-powered for Indian agriculture",
        aiCompanion: "India's AI companion for every farmer.",
        description:
            "Ask about fertilizer schedules, pest control, irrigation plans, and government schemes — grounded in real documents, answered in your language.",
        footer: "Built for kisan, in 22+ Indian languages",
        welcome: "Welcome to AgriChat",
        signInDescription: "Sign in to continue to your farming assistant",
        continueWithGoogle: "Continue with Google",
        termsPrefix: "By continuing, you agree to AgriChat's",
        terms: "Terms",
        and: "and",
        privacyPolicy: "Privacy Policy",
        notSignedIn: "You are not currently signed in.",
        availability:
            "Available in 22+ Indian languages · Fertilizer, pest, irrigation & scheme guidance",
        heroImageAlt: "Farmer working in a field in India",
        signIn: "Sign in",
        signUp: "Sign up",
        createAccount: "Create your AgriChat account",
        signUpDescription: "Enter your details to create an account.",
        name: "Name",
        namePlaceholder: "Enter your name",
        occupation: "Occupation",
        occupationPlaceholder: "Enter your occupation",
        email: "Email",
        emailOptional: "Email (optional)",
        emailPlaceholder: "Enter your email address",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        or: "OR",
        sendOtp: "Send OTP",
        sendingOtp: "Sending OTP...",
        verifyPhone: "Verify your phone number",
        otpSentTo: "We sent a verification code to",
        otp: "OTP",
        otpPlaceholder: "Enter 6-digit OTP",
        otpRequired: "Please enter the OTP.",
        invalidOtp: "Invalid OTP. Please try again.",
        verifyingOtp: "Verifying...",
        verifyAndSignIn: "Verify & Sign In",
        verifyAndCreateAccount: "Verify & Create Account",
        resendOtp: "Resend OTP",
        changePhone: "Change phone number",
        otpResent: "A new OTP has been generated.",
        mockOtpHint: "Development mode: use OTP 123456.",
        phoneVerified: "Phone number verified",
        phoneSignInSuccess: "You have successfully completed the phone sign-in flow.",
        phoneSignUpSuccess: "Your account has been created successfully.",
        useDifferentPhone: "Use a different phone number",
        submitSignUp: "Sign Up",
        alreadyHaveAccount: "Already have an account?",
        switchToSignIn: "Sign in",
        validation: {
            nameRequired: "Name is required.",
            nameInvalid:
                "Name can contain letters, spaces, hyphens, and apostrophes only.",
            occupationRequired: "Occupation is required.",
            occupationInvalid:
                "Occupation can contain letters, spaces, hyphens, and apostrophes only.",
            emailInvalid: "Enter a valid email address.",
            phoneRequired: "Phone number is required.",
            phoneInvalid:
                "Enter a valid 10-digit mobile number.",
        },
        accountCreated: "Account created successfully",
        accountCreatedDescription:
            "Your AgriChat account has been created successfully.",
        continueToSignIn: "Continue to Sign In",
    },
    chat: {
        askAboutDocuments: "Ask about your documents",
        simpleRagMode: "Simple RAG mode",
        multiQueryRagMode: "Multi-query RAG mode ({count} queries)",
        thinking: "Thinking...",
        waitingForResponse:
            "Please wait — your previous question is still being answered.",
        recording: "Recording",
        transcribing: "Transcribing...",
        voiceMessage: "Voice message",
        sendPrompt: "Send prompt",
        recordVoiceMessage: "Dictate prompt",
        inputPlaceholder: "Ask about your indexed documents...",
        assistantTitle: "AgriChat Assistant",
        emptyDescription:
            "Ask questions about your ingested farming documents — fertilizer schedules, pest guides, irrigation plans, and more.",
        composerHint:
            "{mode} · Enter to send · Shift+Enter for new line",
    },

    sourceInspector: {
        title: "Source Inspector",
        subtitle: "Sources used to generate this response.",
        close: "Close source inspector",
        source: "source",
        sources: "sources",
        page: "Page",
        relevance: "Relevance",
    },

    suggestions: {
        fertilizer:
            "What's the recommended fertilizer schedule for paddy?",
        blight:
            "How do I identify early blight in tomato crops?",
        irrigation:
            "What's the ideal irrigation interval for wheat this season?",
        summary:
            "Summarize the pest control guidelines from my uploaded documents.",
    },

    documents: {

        managementTitle: "Document Management",
        managementDescription:
            "Upload, view, and manage the knowledge base your chatbot searches.",
        ingestedDocuments: "Ingested Documents",
        chunks: "chunks",
        searchPlaceholder: "Search documents...",
        dragDropTitle: "Drag & drop PDF files here",
        dragDropSubtitle: "or click to browse · PDF files only",
        unsupportedFileType:
            "could not be uploaded. Unsupported file type.",
        pdfOnly:
            "could not be uploaded. Only PDF files are supported.",
        deleteDocumentTitle: "Delete document?",
        deleteAllDocumentsTitle: "Delete all documents?",
        deleteDocumentMessage:
            'Are you sure you want to delete "{filename}"? This action cannot be undone.',
        deleteAllDocumentsMessage:
            "Are you sure you want to delete all {count} documents? This action cannot be undone.",
        deletedSuccessfully:
            '"{filename}" deleted successfully.',
        deletedAllSuccessfully:
            "{count} document{suffix} deleted successfully.",
        deleteDocumentTooltip: "Delete document",
        deleteDocumentAriaLabel: "Delete {filename}",
        processing: "Processing...",
        waitingInQueue: "Waiting in queue",
        uploading: "Uploading...",
        parsingAndEmbedding: "Parsing & embedding...",
        type: "Type",
        uploaded: "Uploaded",
        zoomOut: "Zoom out",
        zoomIn: "Zoom in",
        searchPdf: "Search PDF",
        searchPdfPlaceholder: "Search within PDF...",
        previousMatch: "Previous match",
        nextMatch: "Next match",
        noMatches: "No matches",
    },

    sessions: {
        title: "Sessions",
        description:
            "Session titles below are illustrative while conversations are using mock data.",
        recentSessions: "Recent sessions",
        refreshing: "Refreshing...",
        refresh: "Refresh",
        loading: "Loading sessions...",
        noSearchResults: "No sessions match your search.",
        empty: "No sessions yet.",
        searchPlaceholder: "Search sessions...",
        searchAriaLabel: "Search sessions",
        message: "message",
        messages: "messages",
        deleteTitle: "Delete session?",
        deleteMessage:
            'Are you sure you want to delete "{title}"? This action cannot be undone.',
        deleteTooltip: "Delete session",
        deleteAriaLabel: "Delete {title}",
    },

    settings: {
        title: "Settings",
        description: "Configuration for this workspace.",
        profile: "Profile",
        name: "Name",
        namePlaceholder: "Enter your name",
        occupation: "Occupation",
        occupationPlaceholder: "Enter your occupation",
        cancel: "Cancel",
        saveChanges: "Save changes",
        ragMode: "RAG Mode",
        simple: "Simple",
        multiquery: "Multiquery",
        selectedQueries: "Multiquery · {count} queries",
        maxQueries: "Max Queries: {count}",
        uploadPicture: "Upload picture",
        changePicture: "Change picture",
        removePicture: "Remove picture"
    },
    notifications: {
        profileSaved: "Profile details saved successfully.",
        profileSaveFailed: "Could not save profile details. Please try again.",

        profilePictureUpdated: "Profile picture updated successfully.",
        profilePictureUpdateFailed:
            "Could not update profile picture. Please try again.",

        profilePictureRemoved: "Profile picture removed successfully.",
        profilePictureRemoveFailed:
            "Could not remove profile picture. Please try again.",

        ragConfigurationSaved: "RAG configuration saved successfully.",
        ragConfigurationSaveFailed:
            "Could not save RAG configuration. Please try again.",

        documentUploaded: '"{filename}" uploaded successfully.',
        documentUploadFailed:
            '"{filename}" could not be uploaded. Please try again.',

        documentDeleted: '"{filename}" deleted successfully.',
        documentDeleteFailed:
            'Could not delete "{filename}". Please try again.',

        sessionDeleted: "Session deleted successfully.",
        sessionDeleteFailed:
            "Could not delete session. Please try again.",

        ttsPreparing: "Please wait while the audio loads.",
        ttsPlaying: "Playing audio.",
        ttsFailed: "Could not play the audio. Please try again.",

        languageChanged: "Language changed to {language}.",
        documentsDeleted: "{count} documents deleted successfully.",
        documentsDeleteFailed:
            "Could not delete documents. Please try again.",
        recordingStarted: "Recording started.",
        recordingConfirmed: "Recording confirmed. Transcribing...",

    },
    app: {
        ragChatbot: "RAG chatbot",
    },
} as const;
