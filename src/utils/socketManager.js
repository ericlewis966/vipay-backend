import DAO from '../services/queries';
import {User} from '../models';
import {SOCKET_EVENTS} from '../config/AppConstraints';
import jwt from 'jsonwebtoken';
let redis, io;
export const connectSocket = async (server, redisClient) => {
  redis = redisClient;
  io = require('socket.io')(server.listener);
  io.on(SOCKET_EVENTS.CONNECTION, async socket => {
    try {
      if (!socket.handshake.query.accessToken) {
        await socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
          success: 0,
          msg: 'Access token not provided',
          statusCode: 401,
        });
        return;
      }

      let data = await checkVerifyToken(
        socket.handshake.query.accessToken.split(' ')[1],
      );

      if (data.err) {
        await socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
          success: 0,
          msg: 'Invalid access token provided',
          statusCode: 401,
        });
        return;
      }

      let findUser = await DAO.getDataOne(
        User,
        {_id: data.data._id},
        {_id: 1, loginTime: 1},
        {lean: true},
      );

      if (!findUser) {
        await socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
          success: 0,
          msg: 'Invalid access token provided',
          statusCode: 401,
        });
        return;
      } else {
        if (findUser.loginTime && findUser.loginTime.length) {
          let isValid = false;
          for (let i = 0; i < findUser.loginTime.length; i++) {
            if (
              Number(findUser.loginTime[i].loginTime) ===
              Number(data.data.loginTime)
            ) {
              isValid = true;
              break;
            }
          }
          if (!isValid) {
            await socket.emit(SOCKET_EVENTS.SOCKET_ERROR, {
              success: 0,
              msg: 'Invalid access token provided',
              statusCode: 401,
            });
            return;
          }
        }
      }
      await redisClient.set(String(findUser._id), socket.id);
      await socket.emit(SOCKET_EVENTS.SOCKET_CONNECTED, {
        statusCode: 200,
        message: 'Socket connected successfully',
        data: {socketId: socket.id},
      });
      await io.sockets.emit(SOCKET_EVENTS.BROADCAST_USER_STATUS, {
        userId: String(findUser._id),
        isOnline: true,
        lastOnline: new Date().getTime(),
      });
      await DAO.update(
        User,
        {_id: findUser._id},
        {$set: {isOnline: true, lastOnline: new Date().getTime()}},
        {lean: true, new: true},
      );

      socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
        let keys = await redis.keys('*');
        let user = '';
        for (let i = 0; i < keys.length; i++) {
          let getValue = await redis.get(keys[i]);
          if (getValue == socket.id) {
            user = keys[i];
            break;
          }
        }
        await io.sockets.emit(SOCKET_EVENTS.BROADCAST_USER_STATUS, {
          userId: user,
          isOnline: false,
          lastOnline: new Date().getTime(),
        });
        if (user) {
          await redis.del(String(user));
          await DAO.update(
            User,
            {_id: ObjectId(user)},
            {$set: {isOnline: false, lastOnline: new Date().getTime()}},
            {lean: true, new: true},
          );
        }
      });
    } catch (err) {
      console.log(err, 'new error');
      await socket.emit(SOCKET_EVENTS.SOCKET_ERROR, err);
      return;
    }
  });
};

export const sendSocketToUser = async (event, data) => {
  await io.sockets.emit(event, data);
};

const checkVerifyToken = async token => {
  return new Promise((resolve, reject) => {
    try {
      let token1 = jwt.verify(token, process.env.JWT_SECRET);
      resolve(token1);
    } catch (err) {
      console.log(err);
      reject({
        err: 'Invalid access token provided',
        success: 0,
        msg: 'Invalid access token provided',
        statusCode: 401,
      });
    }
  });
};
