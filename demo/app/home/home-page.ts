import * as tus from "nativescript-tus-client";
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
import { NavigatedData, Page, EventData } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button";

import { HomeViewModel } from "./home-view-model";
const fs = require('tns-core-modules/file-system');

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new HomeViewModel();
}

export function onTap(args: EventData) {
    const button = <Button>args.object;

    const appPath = fs.knownFolders.currentApp().path + '/';
    const fileName = fs.path.join(appPath, 'assets/test_image.png');

    console.log('FILE NAME: ' + fileName);

    // Create a new tus upload
    var upload = new tus.Upload(fileName, {
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
            // console.log("Download %s from %s", upload.file.name, upload.url)
        }
    })

    // Start the upload
    upload.start()
}
