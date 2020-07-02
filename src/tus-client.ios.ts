import { Common } from './tus-client.common';

export class TusClient extends Common {
    get(): string {
        let version = NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
        return version;
    }
}
