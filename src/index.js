import app from './server';
import http from 'http';

let server = null;

server = http.createServer(app);
let currentApp = app;

const port = process.env.PORT || 40000
server.listen(port, (error) => {
  if (error) {
    console.log(error)
  }
  console.log('🚀 started at localhost:' + port)
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}

