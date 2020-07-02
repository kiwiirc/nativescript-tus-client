import * as application from "tns-core-modules/application";
import { Common } from './tus-client.common';

export class TusClient extends Common {
    get(): string {
        let PackageManager = android.content.pm.PackageManager;
        let pkg = application.android.context.getPackageManager().getPackageInfo(
            application.android.context.getPackageName(),
            PackageManager.GET_META_DATA
        );
      return pkg.versionName;
    }
}
