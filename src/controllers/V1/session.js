
import { User } from '../../models';
import {
  getMagicTokenIssuer,
  generateToken
} from '../../utils/universalFunctions';
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

  static async loginWithDIDToken(payload) {
    try {
      let userMetadata

      if (process.env.NODE_ENV == 'local') {
        userMetadata = { "phoneNumber": '+919875676763' }
      }
      else {
        userMetadata = await getMagicTokenIssuer(payload.token);
      }
      // const userMetadata = { "phoneNumber": payload.token } //for testing
      /**{
        "issuer": "did:ethr:0x93C81fb56Ad9C4129b2e21C1d4904a6264f7D944",
        "publicAddress": "0x93C81fb56Ad9C4129b2e21C1d4904a6264f7D944",
        "email": null,
        "oauthProvider": null,
        "phoneNumber": "+918968124604"
      } */

      //check if referral is valid and same device hasn't been used for the same referral code
      // if (payload.referredBy && payload.deviceId) {
      //   const sameDeviceUser = await Db.getDataOne(User,
      //     { referredBy: { $ne: null }, deviceId: payload.deviceId },
      //     { _id: 1 },
      //     { lean: true }
      //   )

      //   if (sameDeviceUser)
      //     throw 'This device is already registered through a referral'

      // }

      if (userMetadata && userMetadata.phoneNumber) {
        const userData = await Db.findAndUpdate(User,
          { phone: userMetadata.phoneNumber },
          { $setOnInsert: { phone: userMetadata.phoneNumber, email: `${+new Date()}@vi.com` } },
          { upsert: true, lean: true, new: true })

        userData.token = await generateToken({ _id: userData._id })
        return userData
      } else
        throw 'Invalid Credentials'

    } catch (err) {
      console.error(JSON.stringify(err));
      throw err
    }
  }
}
