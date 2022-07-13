import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import Pack from '../../package';
import {AUTH_TOKEN} from './authToken';
const swaggerOptions = {
  info: {
    title: Pack.name,
    version: Pack.version,
  },
  schemes: [process.env.NODE_ENV != 'production' ? 'http' : 'https'],
};

export const Plugins = [
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
  {
    plugin: AUTH_TOKEN,
    name: AUTH_TOKEN.name,
  },
];
