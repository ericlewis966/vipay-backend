import {
    SWAGGER_RESPONSE_MESSAGE,
    STATUS_MSG,
    // REGISTRATION_BY,
    // ASSOCIATED_AS,
} from '../../../config/AppConstraints';

import {
    failActionFunction,
    sendError,
    sendSuccess,
} from '../../../utils/response';

import Joi from 'joi';
import { logger, languageHeader } from '../../../utils/universalFunctions';
import { UserControllers } from '../../../controllers/V1';
const SESSION_ROUTE = [
    {
        method: 'POST',
        path: '/user/v1/sync-contacts',
        options: {
            // auth: {
            //     strategy: 'JwtAuth',
            // },
            handler: async (request, reply) => {
                try {
                    request.payload.language =
                        request.headers['accept-language'] || LANGUAGE.EN;
                    let dataToSend = await UserControllers.syncContacts(request.payload);
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
            validate: {
                failAction: failActionFunction,
                payload: Joi.object({
                    list: Joi.array().items(Joi.object().keys({
                        phone: Joi.string().required().trim(),
                        name: Joi.string()
                    }))
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
    },
];

export default SESSION_ROUTE;
