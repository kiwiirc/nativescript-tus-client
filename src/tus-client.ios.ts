import * as fs from "tns-core-modules/file-system";
import { UploadCommon, UploadOptions } from './tus-client.common';

export class Upload extends UploadCommon {
    private store: TUSUploadStore;
    private tusSession: TUSResumableUpload;

    constructor(file: string, options: UploadOptions) {
        const UPLOAD_PATH = "tus_upload";
        super(file, options);
        let URL = NSURL.URLWithString(fs.path.join(fs.knownFolders.documents().path, UPLOAD_PATH));
        this.store = TUSFileUploadStore.alloc().initWithURL(URL);

        const fileUrl = NSURL.fileURLWithPath(this.file);
        if (!fileUrl.checkResourceIsReachableAndReturnError()) {
            this.options.onError(new Error(`file ${this.file} does not exist`));
            return;
        }

        const uploadEndpoint = NSURL.URLWithString(this.options.endpoint);

        const session = TUSSession.alloc().initWithEndpointDataStoreAllowsCellularAccess(uploadEndpoint, this.store, true);
        this.tusSession = session.createUploadFromFileRetryHeadersMetadata(
            fileUrl, 
            3,
            this.toDictionary(options.headers),
            this.toDictionary(options.metadata)
        );

        if (!this.tusSession) {
            this.options.onError(new Error('could not create upload object'));
        }

        this.tusSession.progressBlock = (bytesSent, bytesTotal) => {
            this.options.onProgress(bytesSent, bytesTotal);
        };

        this.tusSession.resultBlock = (url: NSURL) => {
            this.options.onSuccess();
        };

        this.tusSession.failureBlock = (error: NSError) => {
            this.options.onError(new Error(error.localizedDescription ));
        };
      }

    start(): void {
        this.tusSession.resume();
    }

    abort(): Promise<void> {
        this.tusSession.stop();
        return Promise.resolve();
    }

    private toDictionary(obj): NSDictionary<string, string> {
        let node = NSMutableDictionary.new<string, string>();
        for (let property in obj) {
            if (obj.hasOwnProperty(property)
                && obj[property] != null
                && typeof obj[property] === 'string') {
                    node.setObjectForKey(String(obj[property]), property);
            }
        }
        
        return node;
      }
}
