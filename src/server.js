import express from 'express';
import cookieParser from 'cookie-parser';
import serverRender from './serverRender';
import path from 'path';

const server = express();
server
  .disable('x-powered-by')
  .use(cookieParser())
if(process.env.NODE_ENV==='production'){
  server.use('/static',express.static(path.join(__dirname, '../dist')))
}
server.use('/json', express.static(path.join(__dirname, '../json')))
  .use(serverRender())
  .use(function(err, req, res, next){
    res.status(500).send('Internal Server Error' + err.message);
  });

export default server;
