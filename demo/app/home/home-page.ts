import { File, Folder, knownFolders } from "@nativescript/core";

import * as tus from "nativescript-tus-client";
import { NavigatedData, Page, EventData } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

}

export function startUpload1(args: EventData) {
    upload(<Button>args.object, 1);
}
export function startUpload2(args: EventData) {
    upload( <Button>args.object, 2);
}
export function startUpload3(args: EventData) {
    upload( <Button>args.object, 3);
}
export function startUpload4(args: EventData) {
    upload( <Button>args.object, 4);
}
export function startUpload5(args: EventData) {
    upload( <Button>args.object, 5);
}
export function startUpload6(args: EventData) {
    upload( <Button>args.object, 6);
}
export function startUpload7(args: EventData) {
    upload( <Button>args.object, 7);
}
export function startUpload8(args: EventData) {
    upload( <Button>args.object, 8);
}

function upload(button: Button, i: number){
    console.log('START BUTTON!')

    const appFolder: Folder = <Folder>knownFolders.currentApp();
    
    const file: File = File.fromPath(appFolder.path + '/assets/test_image' + i + '.png');

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://192.168.1.118:1080/files/",
        metadata: {
            filename: 'test_image' + i + '.png',
            filetype: 'image/png'
        },
        onError: function(error) {
            console.log("startUpload Failed because: ", error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log('startUpload', bytesUploaded, bytesTotal, percentage + "%")
            button.setProperty('background', "linear-gradient(to right, #34da26 " + percentage + "%, #f3e7fb " + percentage + "%)");
        },
        onSuccess: function() {
            console.log("startUpload Upload done!");
            console.log(`startUpload Download ${upload.file.name} from ${upload.url}` )
        }
    })

    // Start the upload
    upload.start()
}

export function testAbort(args: EventData) {
    console.log('ABORT BUTTON!')
    const button = <Button>args.object;

    const appFolder: Folder = <Folder>knownFolders.currentApp();
    
    const file: File = File.fromPath(appFolder.path + '/assets/test_image2.png');

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: "http://192.168.1.118:1080/files/",
        metadata: {
            filename: 'test_image.png',
            filetype: 'image/png'
        },
        onError: function(error) {
            console.log("testAbort Failed because: ", error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log('testAbort', bytesUploaded, bytesTotal, percentage + "%")
            button.setProperty('background', "linear-gradient(to right, #34da26 " + percentage + "%, #f3e7fb " + percentage + "%)");
            if ((bytesUploaded / bytesTotal * 100) >= 50) {
                upload.abort();
            }
        },
        onSuccess: function() {
            console.log("testAbort Upload done!");
            console.log(`Download ${upload.file.name} from ${upload.url}` )
        }
    })

    // Start the upload
    upload.start()
}
