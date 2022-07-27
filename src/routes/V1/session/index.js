import {
  SWAGGER_RESPONSE_MESSAGE,
  STATUS_MSG,
  STRATEGY,
  // ASSOCIATED_AS,
} from '../../../config/AppConstraints';
import {
  failActionFunction,
  sendError,
  sendSuccess,
} from '../../../utils/response';
import Joi from 'joi';
import { logger, languageHeader } from '../../../utils/universalFunctions';
import { SessionControllers } from '../../../controllers/V1';
const SESSION_ROUTE = [
  {
    method: 'POST',
    path: '/session/v1/sendOtp',
    options: {
      handler: async (request, reply) => {
        try {
          request.payload.language =
            request.headers['accept-language'] || LANGUAGE.EN;
          let dataToSend = await SessionControllers.sendOtp(request.payload);
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
      description: 'user send otp',
      notes: 'user send otp for verification',
      tags: ['api', 'session'],
      validate: {
        failAction: failActionFunction,
        payload: Joi.object({
          phoneNumber: Joi.string().optional(),
          callingCode: Joi.string().optional(),
        }),
        headers: languageHeader,
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
    method: 'POST',
    path: '/session/v1/login',
    options: {
      // auth: {
      //     strategy: 'JwtAuth',
      // },
      handler: async (request, reply) => {
        try {
          request.payload.language =
            request.headers['accept-language'] || LANGUAGE.EN;
          let dataToSend = await SessionControllers.loginWithDIDToken(request.payload);
          return sendSuccess(
            STATUS_MSG.SUCCESS.DEFAULT,
            dataToSend,
            request.headers['accept-language'] || LANGUAGE.EN,
          );
        } catch (err) {
          return sendError(
            err,
            request.headers['accept-language'] || LANGUAGE.EN,
          );
        }
      },
      description: 'Login/Sign up with magic link DID token',
      tags: ['api', 'session'],
      validate: {
        failAction: failActionFunction,
        payload: Joi.object({
          token: Joi.string(),
          deviceId: Joi.string().required(),
          referredBy: Joi.string()
        }),
        headers: languageHeader,
      },
      plugins: {
        'hapi-swagger': {
          // payloadType: 'form',
          responseMessages: SWAGGER_RESPONSE_MESSAGE,
        },
      },
    },
  }
];

export default SESSION_ROUTE;
