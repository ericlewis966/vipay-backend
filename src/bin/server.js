'use strict';
import 'dotenv/config';
import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import Handlebars from 'handlebars';
import { Routes_v1 } from '../routes/V1';
import { Plugins } from '../plugins';
import { createDefaultData } from '../utils/universalFunctions';
import { connectSocket } from '../utils/socketManager';
import { scheduler } from '../utils/scheduler';
import redis from 'async-redis';
import path from 'path';
class Server {
  init = async () => {
    try {
      const server = new Hapi.Server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: { cors: true },
      });
      // const redisClient = redis.createClient({host: 'localhost', port: 6379});

      // global.Moralis = require('moralis/node');
      // await Moralis.start({
      //   serverUrl: process.env.MORALIS_SERVER_URL,
      //   appId: process.env.MORALIS_APP_ID
      // });

      global.ObjectId = mongoose.Types.ObjectId;
      server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
          return reply.view('index');
        },
      });

      server.route({
        method: 'GET',
        path: '/logo',
        handler: (request, reply) => {
          let filePath = path.join(__dirname, '../views/assets/logo.png');
          return reply.file(filePath);
        },
      });

      server.route({
        method: 'GET',
        path: '/favicon.ico',
        handler: (request, reply) => {
          let filePath = path.join(__dirname, '../views/assets/favicon.ico');
          return reply.file(filePath);
        },
      });

      server.events.on('response', function (request) {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            'api hited',
            JSON.parse(JSON.stringify(request.url)),
            '=======',
          );
        }
      });

      await mongoose.connect(
        // process.env.NODE_ENV === 'development'
        //   ? 
          process.env.DB_URL_LOCAL
          // : process.env.DB_URL_LIVE,
      );

      await server.register(Plugins);
      await server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: path.join(__dirname, '../views'),
      });
      await server.route(Routes_v1);
      await server.start();
      // createDefaultData();
      // connectSocket(server, redisClient);
      console.log('Server running on %s', server.info.uri);
      // scheduler();
    } catch (err) {
      console.log(err, '======error occured======');
    }
  };  
}

export default Server;
