import { UploadCommon, UploadOptions } from './tus-client.common';
import { File } from "@nativescript/core";

export class Upload extends UploadCommon {
    private tusExecutor: io.tus.java.client.TusExecutor;
    private worker: any;

    constructor(file: File, options: UploadOptions) {
        super(file, options);

        const that = this;
        this.tusExecutor = new class extends io.tus.java.client.TusExecutor {
            public makeAttempt() {
                that.startWorker();
            }
        }
    }

    start(): void {
        this.tusExecutor.makeAttempts();
    }

    abort(): Promise<void> {
        this.worker.terminate();
        return Promise.resolve();
    }

    startWorker() {
        // create worker and its callbacks
        let WorkerScript = require("nativescript-worker-loader!./android-worker.js");
        this.worker = new WorkerScript();

        this.worker.onmessage = (msg: any) => {
            if (msg.data.progress !== undefined) {
                console.log(msg.data);
                this.options.onProgress(msg.data.progress.bytesSent, msg.data.progress.bytesTotal);
            } else if (msg.data.error !== undefined) {
                this.stopWorker();
                console.error(msg.data.error);
                this.options.onError(new Error( msg.data.error ));
            } else if (msg.data.url !== undefined) {
                this.stopWorker();
                this.url = msg.data.url;
                this.options.onSuccess();
            }
        };
        this.worker.onerror = (error) => {
            this.stopWorker();
            this.options.onError(new Error( error ));
        };

        // start the 
        this.worker.postMessage({
            endpoint: this.options.endpoint,
            filepath: this.file.path,
            headers: this.options.headers,
            metadata: this.options.metadata
        });
    }

    stopWorker() {
        this.worker.terminate();
    }
}
