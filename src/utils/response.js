import Boom from '@hapi/boom';
import {STATUS_MSG} from '../config/AppConstraints';
export const sendError = async (data, language) => {
  if (
    typeof data == 'object' &&
    data.hasOwnProperty('statusCode') &&
    data.hasOwnProperty('customMessage')
  ) {
    let msg = data.customMessage[language];
    msg = msg.replace(msg.charAt(0), msg.charAt(0).toUpperCase());
    let errorToSend = Boom.badRequest(msg, {statusCode: data.statusCode});
    errorToSend.output.payload.responseType = data.type;
    return errorToSend;
  } else {
    let errorToSend = '';
    if (typeof data == 'object') {
      if (data.name == 'MongoError') {
        errorToSend += STATUS_MSG.ERROR.DB_ERROR.customMessage[language];
        if (data.code == 11000) {
          let duplicateValue =
            data.errmsg &&
            data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
          duplicateValue = duplicateValue.replace('}', '');
          errorToSend +=
            STATUS_MSG.ERROR.DUPLICATE.customMessage[language] +
            ' : ' +
            duplicateValue;
        }
      } else if (data.name == 'ApplicationError') {
        errorToSend += STATUS_MSG.ERROR.APP_ERROR.customMessage[language] + ':';
      } else if (data.name == 'ValidationError') {
        errorToSend +=
          STATUS_MSG.ERROR.APP_ERROR.customMessage[language] + data.message;
      } else if (data.name == 'CastError') {
        errorToSend +=
          STATUS_MSG.ERROR.DB_ERROR.customMessage[language] +
          STATUS_MSG.ERROR.INVALID_ID.customMessage[language] +
          data.value;
      }
    } else {
      errorToSend = data;
    }

    let customErrorMessage = errorToSend || data.toString();
    
    if (typeof customErrorMessage == 'string') {
      if (errorToSend.indexOf('[') > -1) {
        customErrorMessage = errorToSend.substr(errorToSend.indexOf('['));
      }
      customErrorMessage =
        customErrorMessage && customErrorMessage.replace(/"/g, '');
      customErrorMessage =
        customErrorMessage && customErrorMessage.replace('[', '');
      customErrorMessage =
        customErrorMessage && customErrorMessage.replace(']', '');
      customErrorMessage = customErrorMessage.replace(
        customErrorMessage.charAt(0),
        customErrorMessage.charAt(0).toUpperCase(),
      );
    }
    return new Boom.badRequest(customErrorMessage, {statusCode: 400});
  }
};

export const sendSuccess = async (successMsg, data, language) => {
  successMsg = successMsg || STATUS_MSG.SUCCESS.DEFAULT.customMessage;
  if (
    typeof successMsg == 'object' &&
    successMsg.hasOwnProperty('statusCode') &&
    successMsg.hasOwnProperty('customMessage')
  ) {
    return {
      statusCode: successMsg.statusCode,
      message: successMsg.customMessage[language],
      data: data || null,
    };
  } else {
    return {statusCode: 200, message: successMsg, data: data || null};
  }
};

export const failActionFunction = async (request, reply, error) => {
  error.output.payload.type = 'Joi Error';
  if (error.isBoom) {
    delete error.output.payload.validation;
    if (error.output.payload.message.indexOf('authorization') !== -1) {
      error.output.statusCode = ERROR.UNAUTHORIZED.statusCode;
      return error;
    }
    let details = error.details[0];
    if (
      details.message.indexOf('pattern') > -1 &&
      details.message.indexOf('required') > -1 &&
      details.message.indexOf('fails') > -1
    ) {
      error.output.payload.message = 'Invalid ' + details.path;
      return error;
    }
  }
  let customErrorMessage = '';
  if (error.output.payload.message.indexOf('[') > -1) {
    customErrorMessage = error.output.payload.message.substr(
      error.output.payload.message.indexOf('['),
    );
    customErrorMessage = error.output.payload.message
      .replace('[', '')
      .replace(']', '');
  } else {
    customErrorMessage = error.output.payload.message;
  }
  customErrorMessage = customErrorMessage.replace(/"/g, '');
  customErrorMessage = customErrorMessage.replace('[', '');
  customErrorMessage = customErrorMessage.replace(']', '');
  error.output.payload.message = customErrorMessage.replace(/\b./g, a =>
    a.toUpperCase(),
  );
  delete error.output.payload.validation;
  return error;
};
