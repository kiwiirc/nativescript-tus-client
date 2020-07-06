import { File } from "@nativescript/core";

const defaultOptions: UploadOptions = {
  endpoint: null,

  metadata: {},
  uploadSize: null,

  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,

  headers: {},

  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
};

export abstract class UploadCommon {
  options: UploadOptions;
  file: File;
  url: string | null;

  constructor(file: File, options: UploadOptions) {
    this.options = { ...defaultOptions, ...options };

    this.file = file;
    this.url = null;
  }

  abstract start(): void;
  abstract abort(): Promise<void>;
}

export interface UploadOptions {
  endpoint?: string | null;

  metadata?: { [key: string]: string };
  uploadSize?: number | null;

  onProgress?: ((bytesSent: number, bytesTotal: number) => void) | null;
  onChunkComplete?: ((chunkSize: number, bytesAccepted: number, bytesTotal: number) => void) | null;
  onSuccess?: (() => void) | null;
  onError?: ((error: Error) => void) | null;

  headers?: { [key: string]: string };

  chunkSize?: number;
  retryDelays?: number[];
  parallelUploads?: number;
}
