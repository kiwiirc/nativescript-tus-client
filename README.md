# nativescript-tus-client

This NativeScript plugin for TUS - Open Protocol for Resumable File Uploads.
Uses [TUSKit (iOS)](https://github.com/tus/TUSKit) and [tus-android-client](https://github.com/tus/tus-android-client).



## Installation

```bash
tns plugin add nativescript-tus-client
```

## Usage 

```javascript
import { File, Folder, knownFolders } from "@nativescript/core";
import * as tus from "nativescript-tus-client";

// create a File reference
const file = File.fromPath(knownFolders.currentApp().path + 'assets/test_image.png');

// Create a new tus upload
var upload = new tus.Upload(file, {
    endpoint: "http://192.168.1.118:1080/files/",
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
    },
    onSuccess: function() {
        console.log(`Download ${upload.file.name} from ${upload.url}` )
    }
})

// Start the upload
upload.start()
```

## API

`nativesctipt-tus-plugin` implements a very limited subset of the [JS api](https://github.com/tus/tus-js-client).

## Test server

We included a tus test server. Remember to change the host in `test-server/index.js`:

```javascript
const host = '192.168.1.118';
```

then:

```
cd test-server
npm run start
```

You will have to change the host in the demo app at `demo/app/home/home-page.ts` too.
    
## Credits

A big thanks to [coderReview](https://github.com/coderReview) for leading the way with his [nativescript-tus-upload](https://github.com/coderReview/nativescript-tus-upload).

## License

Apache License Version 2.0, January 2004
