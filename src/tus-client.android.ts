import { UploadCommon, UploadOptions } from './tus-client.common';
import { File } from "@nativescript/core";



class UploadManager {
    /* Singleton */
    private static uploadManagerSingleton: UploadManager = null;

    static singleton() :UploadManager {
        if (UploadManager.uploadManagerSingleton === null) {
            UploadManager.uploadManagerSingleton = new UploadManager();
        }
        return UploadManager.uploadManagerSingleton;
    }

    /* class */
    private worker: any = null;
    private uploadQueue: Upload[] = [];
    private currentUpload: Upload = null;

    constructor() {
        let WorkerScript = require("nativescript-worker-loader!./android-worker.js");
        this.worker = new WorkerScript();

        this.worker.onmessage = (msg: any) => {
            if (!this.currentUpload) {
                return;
            }

            this.currentUpload.fromWorker(msg);
        };

        this.worker.onerror = (error) => {
            console.log('worker error: ', error);
            if (this.currentUpload) {
                this.currentUpload.workerError(error);
            }
            // create new worker
            let WorkerScript = require("nativescript-worker-loader!./android-worker.js");
            this.worker = new WorkerScript();
        };
    }

    addUpload(upload:Upload) {
        this.uploadQueue.push(upload);
        this.processNextUpload();
    }

    sendWorker(msg: any) {
        this.worker.postMessage(msg);
    }

    uploadDone(upload: Upload) {
        if (this.currentUpload !== upload) {
            return;
        }
        this.currentUpload = null;
        this.processNextUpload();
    }

    private processNextUpload() {
        // if there is a current upload running, wait for it to finish;
        if (!!this.currentUpload) {
            return;
        }

        const nextUpload = this.uploadQueue.shift();
        if (nextUpload) {
            this.currentUpload = nextUpload;
            this.currentUpload.workerStarted();
        }
    }
}

export class Upload extends UploadCommon {
    private abortResolve: (result: any) => any = null;

    protected doAbort: boolean = false;

    constructor(file: File, options: UploadOptions) {
        super(file, options);
    }

    start(): void {
        UploadManager.singleton().addUpload(this);
    }


    abort(): Promise<void> {
        console.log('called abort()!!!!!!!!!!!!!!!!!');
        this.doAbort = true;

        return new Promise((resolve) => {
            this.abortResolve = resolve;
        })
    }

    fromWorker(msg: any) {
        const action = msg.data.action;
        console.log('received: ' + action);

        switch(action) {
            case 'chunkDone':
                this.options.onProgress(msg.data.progress.bytesSent, msg.data.progress.bytesTotal);
                if (!this.doAbort) {
                    UploadManager.singleton().sendWorker({action: 'nextChunk'});
                }
                else {
                    UploadManager.singleton().sendWorker({action: 'abort'});
                } 
                break;
            case 'done':
                if (msg.data.url) {
                    this.url = msg.data.url;
                    this.options.onSuccess();
                }
                // if aborting, resove the abort promise
                if (this.doAbort && this.abortResolve) {
                    this.abortResolve('aborted');
                }
                UploadManager.singleton().uploadDone(this);
                break;
            case 'error': 
                console.error(msg.data.error);
                this.options.onError(new Error( msg.data.error ));
                break;
            default: break;
        }
    }

    workerStarted() {
        // start the worker
        UploadManager.singleton().sendWorker({
            action: 'start',
            endpoint: this.options.endpoint,
            filepath: this.file.path,
            headers: this.options.headers,
            metadata: this.options.metadata
        });
    }

    workerError(error: string) {
        this.options.onError(new Error( error ));
    }
}
