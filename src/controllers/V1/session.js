
import { User } from '../../models';
import Db from '../../services/queries';

export default class SessionControllers {
  /**
   *
   * @param {*} payload
   */
  static async sendOtp(payload) {
    try {
      const response = await Db.saveData(
        User, 
        {
          "phone": "123",
          "name": "anmol"
        }
      );
      return response
    } catch (err) {
      logger.error(JSON.stringify(err));
      return Promise.reject(err);
    }
  }
}
