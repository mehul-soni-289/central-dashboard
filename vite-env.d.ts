/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_CLIENT_PROFILE_WEBHOOK: string;
    readonly VITE_COMPETITOR_ANALYSIS_WEBHOOK: string;
    readonly VITE_CLIENT_PROFILE_FORM_URL: string;
    readonly VITE_COMPETITOR_ANALYSIS_FORM_URL: string;
    readonly VITE_RAG_KNOWLEDGE_BASE_URL: string;
    readonly VITE_LOGO_URL: string;
    readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
