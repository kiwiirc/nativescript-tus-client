const tus = require('tus-node-server');
const EVENTS = require('tus-node-server').EVENTS;

const server = new tus.Server();
server.datastore = new tus.FileStore({
    path: '/files'
});

const host = '192.168.1.158';
const port = 1080;
server.listen({ host, port }, () => {
    console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`);
});

server.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
    console.log(`Upload complete for file ${event.file.id}`);
    console.dir(event.file);
});

server.on(EVENTS.EVENT_FILE_CREATED, (event) => {
    console.log(`EVENT_FILE_CREATED`, event.file);
    console.dir(event.file);
})
