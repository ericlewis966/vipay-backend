export const COMMON_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
};

export const MODELS_NAME = {
  USER: 'user',
};

export const NOTIFICATION_TOPIC = {
  ENGLISH: 'ENGLISH',
  ALL: 'ALL',
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  SOCKET_ERROR: 'socketError',
  SOCKET_CONNECTED: 'socketConnected',
  DISCONNECT: 'disconnect',
  BROADCAST_USER_STATUS: 'boradCastUserStatus',
};

export const DEVICE_TYPE = {
  WEB: 'WEB',
  ANDROID: 'ANDROID',
  IOS: 'IOS',
};

export const DEVICE_CATEGORY = {
  WEB: 'WEB',
  APP: 'APP',
};

export const USER_TYPE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  USER: 'USER',
};

export const LANGUAGE = {
  EN: 'en',
};

export const STRATEGY = {
  USER: 'user',
};

export const SORTING_SEQUENCE = {
  ASC: 1,
  DESC: -1,
};

export const CONTACT_REQUEST_STATUS = {
  PENDING: 1,
  RESOLVED: 2,
};

export const NOTIFICATION_TYPE = {};

export const SERVER = {
  SALT: 10,
  FCM_SERVER_KEY: 'test',
  FCM_API_LINK: 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks',
  FCM_API_KEY: '',
  SITE_URL: 'https://vipay.page.link',
  MAX_DISTANCE: 20000,
};

export const SMS_MESSAGES = {
  OTP_VERIFICATION: (otp, language) => {
    switch (language) {
      case LANGUAGE.EN:
        return `Your ViPay verification code is ${otp}. please do not disclose with anyone for security reason`;
      default:
        return `Your ViPay verification code is ${otp}. please do not disclose with anyone for security reason`;
    }
  },

  CONTACT_US_REQUEST_MESSAGE: data => {
    return `<p>Hi ${data.name}<br />
            Your query has been recorded in our queue <br /><br />
            ${data.note},<br />
            Your ticket id is ${data.displayId}.<br />
            Our team will revert you soon <br />
            Thanks and regards<br />
            vipay Team
            </p>`;
  },

  CONTACT_US_REQUEST_RESOLVED_MESSAGE: data => {
    return `<p>Hi ${data.name}<br />
    Your query has been been resolved with given note <br /><br />
    ${data.resolveNote},<br />
    for your ticket ${data.displayId}.<br />
    Please feel free to contact us if you have still any query <br />
    Thanks and regards<br />
    vipay Team
    </p>`;
  },

  FORGOT_PASSWORD_OTP: data => {
    return `Hi, ${data.name} \n Please use code ${data.otp} for reset your password. \n
    Please do not share with anyone for security reasons.\n Thanks ViPay`;
  },
};

export const STATUS_MSG = {
  ERROR: {
    ENTER_PHONE_OR_EMAIL_FOR_REGISTRATION: {
      statusCode: 400,
      type: 'ENTER_PHONE_OR_EMAIL_FOR_REGISTRATION',
      customMessage: {
        en: 'Please enter either email or phone number for registration',
      },
    },

    ENTER_PHONE_OR_EMAIL_FOR_LOGIN: {
      statusCode: 400,
      type: 'ENTER_PHONE_OR_EMAIL_FOR_LOGIN',
      customMessage: {
        en: 'Please enter either email or phone number for login',
      },
    },

    INVALID_EMAIL_PROVIDED: {
      statusCode: 400,
      type: 'INVALID_EMAIL_PROVIDED',
      customMessage: {
        en: 'Invalid email provided',
      },
    },

    COUNTRY_NAME_ALREADY_EXISTS: {
      statusCode: 400,
      type: 'COUNTRY_NAME_ALREADY_EXISTS',
      customMessage: {
        en: 'Country name you have entered is already taken',
      },
    },

    ENTER_PHONE_OR_EMAIL_FOR_FORGOT: {
      statusCode: 400,
      type: 'ENTER_PHONE_OR_EMAIL_FOR_FORGOT',
      customMessage: {
        en: 'Please enter either email or phone number for forgot password',
      },
    },

    INVALID_EMAIL_OR_PHONE_NUMBER_PROVIDED: {
      statusCode: 400,
      type: 'INVALID_EMAIL_OR_PHONE_NUMBER_PROVIDED',
      customMessage: {
        en: 'Invalid email or phone number provided',
      },
    },

    INVALID_OTP_PROVIDED: {
      statusCode: 400,
      type: 'INVALID_OTP_PROVIDED',
      customMessage: {
        en: 'Invalid otp provided',
      },
    },

    INVALID_TOKEN: {
      statusCode: 401,
      customMessage: {
        en: 'You are unauthorized or your session has been expired.',
      },
      type: 'INVALID_TOKEN',
    },
    UNAUTHORIZED: {
      statusCode: 401,
      customMessage: {
        en: 'You are not authorized to perform this action',
      },
      type: 'UNAUTHORIZED',
    },
    SOMETHING_WENT_WRONG: {
      statusCode: 400,
      type: 'SOMETHING_WENT_WRONG',
      customMessage: {
        en: 'Something went wrong on server. ',
      },
    },

    NO_ACCESS_OF_ACTION: {
      statusCode: 400,
      type: 'NO_ACCESS_OF_ACTION',
      customMessage: {
        en: 'You have no access to perform this action ',
      },
    },

    INVALID_OR_EXPIRED_OTP_PROVIDED: {
      statusCode: 400,
      type: 'INVALID_OR_EXPIRED_OTP_PROVIDED',
      customMessage: {
        en: 'Invalid or expired otp provided ',
      },
    },

    INVALID_FORGOT_ID_PROVIDED: {
      statusCode: 400,
      type: 'INVALID_FORGOT_ID_PROVIDED',
      customMessage: {
        en: 'Invalid forgot id provided ',
      },
    },

    PHONE_NUMBER_ALREADY_EXISTS: {
      statusCode: 400,
      type: 'PHONE_NUMBER_ALREADY_EXISTS',
      customMessage: {
        en: 'The phone number you have entered is already taken.',
      },
    },

    EMAIL_ALREADY_EXISTS: {
      statusCode: 400,
      type: 'EMAIL_ALREADY_EXISTS',
      customMessage: {
        en: 'The email you have entered is already taken',
      },
    },

    ACCOUNT_NO_LONGER_EXISTS_VERIFY: {
      statusCode: 400,
      type: 'ACCOUNT_NO_LONGER_EXISTS_VERIFY',
      customMessage: {
        en: 'account no longer exists, please contact to vipay',
      },
    },

    ACCOUNT_SUSPENDED_VERIFY: {
      statusCode: 400,
      type: 'ACCOUNT_SUSPENDED_VERIFY',
      customMessage: {
        en: 'Your account has been suspended by ViPay,  please contact to ViPay',
      },
    },

    ACCOUNT_SUSPENDED: {
      statusCode: 400,
      type: 'ACCOUNT_SUSPENDED',
      customMessage: {
        en: 'Your account has been suspended by ViPay,  please contact to ViPay',
      },
    },

    NO_SESSION_AVAILABLE: {
      statusCode: 400,
      customMessage: {
        en: 'No session available',
      },
      type: 'NO_SESSION_AVAILABLE',
    },

    IMP_ERROR: {
      statusCode: 500,
      customMessage: {
        en: 'Implementation Error',
      },
      type: 'IMP_ERROR',
    },
    EMAIL_NOT_EXISTS: {
      statusCode: 400,
      customMessage: {
        en: 'The email address you have entered is not registered with us',
      },
      type: 'EMAIL_NOT_EXISTS',
    },

    INVALID_PASSWORD_PROVIDED: {
      statusCode: 400,
      customMessage: {
        en: 'Invalid password provided',
      },
      type: 'INVALID_PASSWORD_PROVIDED',
    },

    DB_ERROR: {
      statusCode: 400,
      customMessage: {
        en: 'DB Error : ',
      },
      type: 'DB_ERROR',
    },
    DUPLICATE: {
      statusCode: 400,
      customMessage: {
        en: 'Duplicate Entry',
      },
      type: 'DUPLICATE',
    },
    APP_ERROR: {
      statusCode: 400,
      customMessage: {
        en: 'Application error ',
      },
      type: 'APP_ERROR',
    },
    INVALID_ID: {
      statusCode: 400,
      customMessage: {
        en: 'Invalid id or item is currently unavailable',
      },
      type: 'INVALID_ID',
    },

    ACCOUNT_NO_LONGER_EXISTS: {
      statusCode: 401,
      customMessage: {
        en: 'your account no longer exists, please contact to ViPay',
      },
      type: 'ACCOUNT_NO_LONGER_EXISTS',
    },
  },
  SUCCESS: {
    SOCKET_CONNECTED: {
      statusCode: 200,
      customMessage: {
        en: 'Connected Successfully',
      },
      type: 'SOCKET_CONNECTED',
    },
    CREATED: {
      statusCode: 200,
      customMessage: {
        en: 'Created Successfully',
      },
      type: 'CREATED',
    },
    DEFAULT: {
      statusCode: 200,
      customMessage: {
        en: 'Successfully',
      },
      type: 'DEFAULT',
    },
  },
};

export const SWAGGER_RESPONSE_MESSAGE = [
  {code: 200, message: 'OK'},
  {code: 400, message: 'Bad Request'},
  {code: 401, message: 'Unauthorized'},
  {code: 404, message: 'Data Not Found'},
  {code: 500, message: 'Internal Server Error'},
];

export const NOTIFICATION_MESSAGES = {};
