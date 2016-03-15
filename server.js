const fs = require('fs');
const bunyan = require('bunyan');
const Hapi = require('hapi');
const Good = require('good');
const Promise = require('bluebird');
const rp = require('request-promise');

// Enable smart logger
const log = bunyan.createLogger({
  name: 'app',
  streams: [{
    path: 'log.json'
  }]
});

// Spin up Hapi server
const server = new Hapi.Server();
server.connection({
  port: 8080
});

// Routes
server.route({
  method: 'POST',
  path: '/submit',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },
    handler: (req, reply) => {
      function processFile(incomingStream, url) {
        // TODO: figure out how to use this incoming stream directly,
        // instead of writing it to the filesystem
        return new Promise((resolve, reject) => {
          const name = incomingStream.hapi.filename;
          const path = `${__dirname}/uploads/${name}`;
          const newFile = fs.createWriteStream(path);

          incomingStream.on('error', err => {
            log.warn(err);
          });
          incomingStream.pipe(newFile);
          incomingStream.on('end', err => {
            const formData = {
              f: 'json',
              attachment: fs.createReadStream(path)
            };

            rp({
              method: 'POST',
              uri: `${url}/addAttachment`,
              formData
            })
            .then((response) => {
              fs.unlink(path);
              resolve({ name, response });
            })
            .catch(error => {
              log.warn(error);
              reject(error);
            });
          });
        });
      }

      const fileOps = [];
      const featureUrl = req.payload.featureUrl;
      const data = req.payload;
      if (data.uploads) {
        if (data.uploads.length) {
          data.uploads.forEach(upload => {
            fileOps.push(processFile(upload, featureUrl));
          });
        } else {
          fileOps.push(processFile(data.uploads, featureUrl));
        }
        Promise.all(fileOps).then(response => {
          reply(JSON.stringify(response));
        }, error => {
          reply(JSON.stringify(error));
        });
      }
    }
  }
});

// Static Routes
server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  // Test Page
  server.route({
    method: 'GET',
    path: '/test',
    handler: (req, reply) => {
      log.info(req);
      reply.file('./public/form.html');
    }
  });
});

/* Plugins */

// Hapi process monitoring
server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, (err) => {
  if (err) {
    throw err;
  }
});

// Start the Hapi server
server.start((err) => {
  if (err) {
    throw err;
  }
  server.log('info', `Server running at ${server.info.uri}`);
});
