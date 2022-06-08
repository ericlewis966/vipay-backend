import {STRATEGY} from '../config/AppConstraints';
import {verifyToken} from '../utils/universalFunctions';
export const AUTH_TOKEN = {
  name: 'auth',
  register: async (server, options) => {
    await server.register(require('hapi-auth-jwt2'));
    /** verify user token stategy */
    server.auth.strategy(STRATEGY.USER, 'jwt', {
      key: process.env.JWT_SECRET,
      validate: token => verifyToken(token),
      verifyOptions: {algorithms: ['HS256']},
    });
  },
};
