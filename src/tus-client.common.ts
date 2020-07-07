import { File } from "@nativescript/core";

const defaultOptions: UploadOptions = {
  endpoint: null,

  headers: {},
  metadata: {},

  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,

};

export abstract class UploadCommon {
  public static defaultOptions = defaultOptions;

  options: UploadOptions;
  file: File;
  url: string | null;

  constructor(file: File, options: UploadOptions) {
    this.options = { ...UploadCommon.defaultOptions, ...options };

    this.file = file;
    this.url = null;
  }

  abstract start(): void;
  abstract abort(): Promise<void>;
}

export interface UploadOptions {
  endpoint?: string | null;

  headers?: { [key: string]: string };
  metadata?: { [key: string]: string };

  onProgress?: ((bytesSent: number, bytesTotal: number) => void) | null;
  onChunkComplete?: ((chunkSize: number, bytesAccepted: number, bytesTotal: number) => void) | null;
  onSuccess?: (() => void) | null;
  onError?: ((error: Error) => void) | null;

}
