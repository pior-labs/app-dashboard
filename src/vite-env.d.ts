/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DASHBOARD_LINKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
