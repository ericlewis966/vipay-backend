import {
  SWAGGER_RESPONSE_MESSAGE,
  STATUS_MSG,
  LANGUAGE,
  STRATEGY
} from '../../../config/AppConstraints';
import {
  failActionFunction,
  sendError,
  sendSuccess,
} from '../../../utils/response';
import Joi from 'joi';
import { authorizationHeader, getFileBuffer } from '../../../utils/universalFunctions';
import { logger, languageHeader } from '../../../utils/universalFunctions';
import { FileTransferControllers } from '../../../controllers/V1';
const FILE_TRANSFER_ROUTE = [
  {
    method: 'POST',
    path: '/fileTransfer/v1/upload',
    options: {
      handler: async (request, reply) => {
        try {
          let dataToSend = await FileTransferControllers.uploader(request.auth.credentials.data, request.payload);
          return sendSuccess(
            STATUS_MSG.SUCCESS.DEFAULT,
            dataToSend,
            request.headers['accept-language'] || LANGUAGE.EN,
          );
        } catch (err) {
          logger.error(JSON.stringify(err));
          return sendError(
            err,
            request.headers['accept-language'] || LANGUAGE.EN,
          );
        }
      },
      description: 'upload file',
      notes: 'select a valid file and upload it',
      tags: ['api', 'fileTransfer'],
      auth: {
        strategy: STRATEGY.USER
      },
      payload: {
        maxBytes: 200000000,
        parse: true,
        output: 'file',
        timeout: false,
        multipart: true,
      },
      validate: {
        failAction: failActionFunction,
        payload: Joi.object({
          file: Joi.any().meta({ swaggerType: 'file' }).required(),
        }),
        headers: authorizationHeader,
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          responseMessages: SWAGGER_RESPONSE_MESSAGE,
        },
      },
    },
  },

  {
    method: 'GET',
    path: '/fileTransfer/v1/resizer/{image}/{height}/{width}',
    options: {
      handler: async (request, reply) => {
        try {
          let dataToSend = await getFileBuffer(request.params);
          return reply.file(dataToSend);
        } catch (err) {
          logger.error(JSON.stringify(err));
          return sendError(
            err,
            request.headers['accept-language'] || LANGUAGE.EN,
          );
        }
      },
      description: 'rezize file',
      notes: 'add adds while putting adds data',
      tags: ['api', 'fileTransfer'],
      validate: {
        failAction: failActionFunction,
        params: Joi.object({
          image: Joi.string().required(),
          height: Joi.number().required(),
          width: Joi.number().required(),
        }),
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
          responseMessages: SWAGGER_RESPONSE_MESSAGE,
        },
      },
    },
  },
];

export default FILE_TRANSFER_ROUTE;
