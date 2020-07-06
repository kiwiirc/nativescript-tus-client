import * as application from "tns-core-modules/application";
import { UploadCommon } from './tus-client.common';

export class Upload extends UploadCommon {
    start(): void {
        throw new Error("Method not implemented.");
    }
    abort(shouldTerminate?: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
