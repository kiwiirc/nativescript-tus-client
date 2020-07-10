if (global["TNS_WEBPACK"]) {
  if (global.android) {
    // without this JavaProxy is missing and we can't import vendor below
    global.require("~/../internal/ts_helpers.js");
  }
  global.require("~/vendor");
} else {
  require("globals");
}
const utils = require("tns-core-modules/utils/utils");
const application = require("tns-core-modules/application");

application.on(application.uncaughtErrorEvent, function (args) {
  if (args.android) {
    // For Android applications, args.android is an NativeScriptError.
    console.log("NativeScriptError: " + args.android);
  } else if (args.ios) {
    // For iOS applications, args.ios is NativeScriptError.
    console.log("NativeScriptError: " + args.ios);
  }
});

/*
States: INIT, UPLOADING, DONE
msg in: start, nextChunk, abort
msg out: chunkDone, done
[INIT] ---------------> [UPLOADING]     -------------> [DONE]
      <<<start          >>>chunkDone    <<<abort       >>>done
                        <<<nextChunk    >>>error
*/                  
let currentState = 'INIT';

let progress = { bytesTotal: 0, bytesSent: 0 }

let uploader = null;

global.onmessage = function (msg) {
  console.log('---- received msg', msg.data);
  const action = msg.data.action;

  if (action === 'start' && currentState === 'INIT') {
    start(msg.data);
  }
  else if (action === 'nextChunk' && currentState === 'UPLOADING') {
    uploadChunk();
  }

  else if (action === 'abort') {
    cleanup();
  }
};

function start({filepath, endpoint, metadata, headers}) {
  console.log('---- start');
  logState();

  try {
    console.log('typeof java.io.File: ' + typeof java.io.File )
    const file = new java.io.File(filepath);
  
    const upload = new io.tus.java.client.TusUpload(file);
    upload.setMetadata(toHashMap(metadata));
    progress.bytesTotal = upload.getSize();
    const pref = utils.ad
      .getApplicationContext()
      .getSharedPreferences("tus_upload", 0);
    const client = new io.tus.java.client.TusClient();
  
    client.setUploadCreationURL(new java.net.URL(endpoint));
    client.setHeaders(toHashMap(headers));
    client.enableResuming(
      new io.tus.android.client.TusPreferencesURLStore(pref)
    );
  
    uploader = client.resumeOrCreateUpload(upload);
  
    uploader.setChunkSize(32 * 1024);
  } catch (ex) {
    global.postMessage({action: 'error', error: ex.message || ex });
    cleanup();
    return;
  }
  currentState = "UPLOADING";
  uploadChunk();
}

function uploadChunk() {
  console.log('---- uploadChunk');
  logState();
  let chunkSize;
  try {
    chunkSize = uploader.uploadChunk();
    progress.bytesSent = uploader.getOffset();

    console.log('-chunkSize: ' + chunkSize);
    if (chunkSize <= -1 || progress.bytesSent === progress.bytesTotal) {
      done();
    }
    else {
      global.postMessage({ action: 'chunkDone', progress: progress });
    }
  } catch(ex) {
    global.postMessage({action: 'error', error: ex.message || ex });
    cleanup();
  }


}

function done() {
  console.log('---- done');
  logState();
  currentState = 'DONE';
  global.postMessage({ action: 'done', url: uploader.getUploadURL().toString() });
  cleanup();
}

function cleanup() {
  console.log('---- cleanup');
  logState();
  try {
    uploader.finish();
    uploader = null;
  } catch(ex) {
    global.postMessage({action: 'error', error: ex.message || ex });
  } finally {
    // global.close();
  }
}

function logState() {
  console.log("uploader is null: " + (uploader == null));
  console.log("state: " + currentState);
  console.log("progress: ", progress);
}

function toHashMap(obj) {
  var node = new java.util.HashMap();
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (obj[property] != null) {
        switch (typeof obj[property]) {
          case "string":
            node.put(property, String(obj[property]));
            break;
        }
      }
    }
  }
  return node;
}
