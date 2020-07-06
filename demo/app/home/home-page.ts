import { File, Folder, knownFolders } from "@nativescript/core";

import * as tus from "nativescript-tus-client";
import { NavigatedData, Page, EventData } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new HomeViewModel();
}

export function onTap(args: EventData) {
    const button = <Button>args.object;

    const appFolder: Folder = <Folder>knownFolders.currentApp();
    
    const file: File = File.fromPath(appFolder.path + 'assets/test_image.png');

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://192.168.1.118:1080/files/",
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: 'test_image.png',
            filetype: 'image/png'
        },
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
            button.page.bindingContext.set('progressValue', percentage)
        },
        onSuccess: function() {
            console.log("Upload done!");
            console.log(`Download ${upload.file.name} from ${upload.url}` )
        }
    })

    // Start the upload
    upload.start()
}
