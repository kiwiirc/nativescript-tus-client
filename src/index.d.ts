export class Upload {
  constructor(file: string, options: UploadOptions);
  abstract start(): void;
  abstract abort(): Promise<void>;
}

export interface UploadOptions {
  endpoint?: string | null;

  metadata?: { [key: string]: string };
  fingerprint?: (file: File, options?: UploadOptions) => Promise<string>;
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