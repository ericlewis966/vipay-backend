import { logger } from '../../utils/universalFunctions';
import {
  fileUpload,
  resizeImageToThumbnail,
  uploadFileBuffer
} from '../../utils/universalFunctions';
export default class FileTransferControllers {
  /**
   * @param {*} payload
   */
  static async uploader(userAuthData, payload) {
    try {
      if (Array.isArray(payload.file)) {
        let fileData = [];
        for (let i = 0; i < payload.file.length; i++) {
          let file = await fileUpload(payload.file[i]);
          fileData.push({ image: file });
        }
        return fileData;
      } else {
        // let file = await uploadFileBuffer(payload.file['path'], `${+new Date()}-${userAuthData._id}`, payload.file.headers['content-type'], userAuthData._id);
        let imageBuffer = resizeImageToThumbnail(payload.file['path'])
        let file = await uploadFileBuffer(payload.file['path'], `1655392747779-62aadde041286b65f3f56756`, payload.file.headers['content-type'], userAuthData._id);
        return file
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      return Promise.reject(err);
    }
  }
}
