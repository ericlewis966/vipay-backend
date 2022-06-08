import admin from 'firebase-admin';
import firebaseCredential from './firebasecreds.json';

/**************************************************************************************
 *****************                                                        **************
 *****************           Push notification handeler                   **************
 *****************                                                        **************
 ***************************************************************************************/
admin.initializeApp({
  credential: admin.credential.cert(firebaseCredential),
  databaseURL: '',
});

export const sendNotification = async (deviceToken, payload) => {
  try {
    if (deviceToken) {
      let message = {
        notification: {
          title: payload.title,
          body: payload.message,
        },
        data: {
          type: payload.type ? String(payload.type) : '',
        },
        token: deviceToken,
      };
      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
          return {};
        })
        .catch((error) => {
          console.log('Error sending message:', error);
          return {};
        });
    }
  } catch (err) {
    console.log(err, '=============error=============');
    return {};
  }
};

export const sendAdminNotification = async (payload, condition) => {
  try {
    if (condition) {
      let message = {
        notification: {
          title: payload.title,
          body: payload.message,
        },
        condition: condition,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log('Successfully sent message with condition', response);
          return {};
        })
        .catch((error) => {
          console.log('Error sending message:', error);
          return {};
        });
    }
  } catch (err) {
    console.log(err, '=============error=============');
    return {};
  }
};