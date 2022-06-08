import {logger} from '../../utils/universalFunctions';
import {fileUpload} from '../../utils/universalFunctions';
export default class FileTransferControllers {
  /**
   * @param {*} payload
   */
  static async uploader(payload) {
    try {
      if (Array.isArray(payload.file)) {
        let fileData = [];
        for (let i = 0; i < payload.file.length; i++) {
          let file = await fileUpload(payload.file[i]);
          fileData.push({image: file});
        }
        return fileData;
      } else {
        let file = await fileUpload(payload.file);
        return {url: file};
      }
    } catch (err) {
      logger.error(JSON.stringify(err));
      return Promise.reject(err);
    }
  }
}
