import { UploadCommon, UploadOptions } from './tus-client.common';
import { File } from "@nativescript/core";

export class Upload extends UploadCommon {
    private tusExecutor: NSTusExecutor;
    private worker: any;

    private doAbort: boolean = false;

    constructor(file: File, options: UploadOptions) {
        super(file, options);

        const that = this;
        this.tusExecutor = new NSTusExecutor();
        this.tusExecutor.nsTusUpload = this;
    }

    start(): void {
        this.tusExecutor.makeAttempts();
    }

    abort(): Promise<void> {
        console.log('called abort()!!!!!!!!!!!!!!!!!');
        this.doAbort = true;
        return Promise.resolve();
    }

    startWorker() {
        // create worker and its callbacks
        let WorkerScript = require("nativescript-worker-loader!./android-worker.js");
        this.worker = new WorkerScript();

        this.worker.onmessage = (msg: any) => {
            const action = msg.data.action;
            console.log('received: ' + action);

            switch(action) {
                case 'chunkDone':
                    this.options.onProgress(msg.data.progress.bytesSent, msg.data.progress.bytesTotal);
                    if (!this.doAbort) {
                        this.worker.postMessage({action: 'nextChunk'});
                    }
                    else {
                        this.worker.postMessage({action: 'abort'});
                    }
                    break;
                case 'done':
                    this.url = msg.data.url;
                    this.options.onSuccess();
                    setTimeout(() => {
                        this.worker.terminate();
                    }, 1000);
                    break;
                case 'error': 
                    console.error(msg.data.error);
                    this.options.onError(new Error( msg.data.error ));
                    break;
                default: break;
            }
        };

        this.worker.onerror = (error) => {
            console.log('worker error: ', error);
            this.abortWorker();
            this.options.onError(new Error( error ));
        };

        // start the worker
        this.worker.postMessage({
            action: 'start',
            endpoint: this.options.endpoint,
            filepath: this.file.path,
            headers: this.options.headers,
            metadata: this.options.metadata
        });
    }

    abortWorker() {
        if (this.worker) {
            console.log('Sending abort!');
            this.worker.postMessage({
                abort: true
            });
        }
    }
}

class NSTusExecutor extends io.tus.java.client.TusExecutor {
    private _nsTusUpload :Upload = null;

    public makeAttempt() {
        this._nsTusUpload.startWorker();
    }

    public set nsTusUpload(value : Upload) {
        this._nsTusUpload = value;
    }
    
}
