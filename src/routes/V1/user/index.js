import {
    SWAGGER_RESPONSE_MESSAGE,
    STATUS_MSG,
    STRATEGY
    // REGISTRATION_BY,
    // ASSOCIATED_AS,
} from '../../../config/AppConstraints';

import {
    failActionFunction,
    sendError,
    sendSuccess,
} from '../../../utils/response';

import Joi from 'joi';
import { logger, authorizationHeader } from '../../../utils/universalFunctions';
import { UserControllers } from '../../../controllers/V1';
const USER_ROUTE = [
    {
        method: 'POST',
        path: '/user/v1/sync-contacts',
        options: {
            handler: async (request, reply) => {
                try {
                    request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
                    let dataToSend = await UserControllers.syncContacts(request.auth.credentials.data, request.payload);
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
            description: 'sync contacts',
            tags: ['api', 'user'],
            auth: {
                strategy: STRATEGY.USER
            },
            validate: {
                failAction: failActionFunction,
                payload: Joi.object({
                    list: Joi.array().items(Joi.object().keys({
                        phone: Joi.string().required().trim(),
                        name: Joi.string()
                    }))
                }),
                headers: authorizationHeader,
            },
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    responseMessages: SWAGGER_RESPONSE_MESSAGE,
                },
            },
        },
    },
    {
        method: 'PUT',
        path: '/user/v1/edit-profile',
        options: {
            handler: async (request, reply) => {
                try {
                    request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
                    let dataToSend = await UserControllers.editProfile(request.auth.credentials.data, request.payload);
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
            description: 'edit profile',
            tags: ['api', 'user'],
            auth: {
                strategy: STRATEGY.USER
            },
            validate: {
                failAction: failActionFunction,
                payload: Joi.object({
                    name: Joi.string().trim(),
                    emailOTPVerificationDIDToken: Joi.string().description('DID token from magic if email OTP authentication successful'),
                    phoneOTPVerificationDIDToken: Joi.string().description('DID token from magic if SMS OTP authentication successful'),
                    defaultArgument: Joi.string().default('NA')
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
        method: 'PUT',
        path: '/user/v1/update-profile-pic',
        options: {
            handler: async (request, reply) => {
                try {
                    request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
                    let dataToSend = await UserControllers.editProfile(request.auth.credentials.data, request.payload);
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
            tags: ['api', 'user'],
            auth: {
                strategy: STRATEGY.USER
            },
            payload: {
                maxBytes: 5000000,
                parse: true,
                output: 'file',
                timeout: false,
                multipart: true,
            },
            validate: {
                failAction: failActionFunction,
                payload: Joi.object({
                    profilePic: Joi.any().meta({ swaggerType: 'file' })
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
      method: 'PUT',
      path: '/user/v1/set-pin',
      options: {
        handler: async (request, reply) => {
          try {
            request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
            let dataToSend = await UserControllers.setPin(request.auth.credentials.data, request.payload);
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
        tags: ['api', 'user'],
        auth: {
          strategy: STRATEGY.USER
        },
        validate: {
          failAction: failActionFunction,
          payload: Joi.object({
            pin: Joi.string().length(4).required()
          }),
          headers: authorizationHeader,
        },
        plugins: {
          'hapi-swagger': {
            // payloadType: 'form',
            responseMessages: SWAGGER_RESPONSE_MESSAGE,
          },
        },
      },
    },
    {
      method: 'PUT',
      path: '/user/v1/change-pin',
      options: {
        handler: async (request, reply) => {
          try {
            request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
            let dataToSend = await UserControllers.changePin(request.auth.credentials.data, request.payload);
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
        tags: ['api', 'user'],
        auth: {
          strategy: STRATEGY.USER
        },
        validate: {
          failAction: failActionFunction,
          payload: Joi.object({
            oldPin: Joi.string().length(4).required(),
            newPin: Joi.string().length(4).required()
          }),
          headers: authorizationHeader,
        },
        plugins: {
          'hapi-swagger': {
            // payloadType: 'form',
            responseMessages: SWAGGER_RESPONSE_MESSAGE,
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/user/v1/verify-pin',
      options: {
        handler: async (request, reply) => {
          try {
            request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
            let dataToSend = await UserControllers.verifyPin(request.auth.credentials.data, request.payload);
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
        tags: ['api', 'user'],
        auth: {
          strategy: STRATEGY.USER
        },
        validate: {
          failAction: failActionFunction,
          payload: Joi.object({
            pin: Joi.string().length(4).required()
          }),
          headers: authorizationHeader,
        },
        plugins: {
          'hapi-swagger': {
            // payloadType: 'form',
            responseMessages: SWAGGER_RESPONSE_MESSAGE,
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/user/v1/save-wallet',
      options: {
        handler: async (request, reply) => {
          try {
            request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
            let dataToSend = await UserControllers.saveWallet(request.auth.credentials.data, request.payload);
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
        tags: ['api', 'user'],
        auth: {
          strategy: STRATEGY.USER
        },
        validate: {
          failAction: failActionFunction,
          payload: Joi.object({
            walletAddress: Joi.string().required(),
            walletLabel: Joi.string().required()
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
      method: 'POST',
      path: '/user/v1/raise-support-query',
      options: {
        handler: async (request, reply) => {
          try {
            request.payload.language = request.headers['accept-language'] || LANGUAGE.EN;
            let dataToSend = await UserControllers.raiseSupportQuery(request.auth.credentials.data, request.payload);
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
        tags: ['api', 'user'],
        auth: {
          strategy: STRATEGY.USER
        },
        validate: {
          failAction: failActionFunction,
          payload: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().required(),
            message: Joi.string().min(1).required(),
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
    }
];

export default USER_ROUTE;
