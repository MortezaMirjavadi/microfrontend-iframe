/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_APP_TITLE: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    [key: string]: string | boolean | undefined;
  };
}
