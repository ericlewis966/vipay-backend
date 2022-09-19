
import { User, AppConstants } from '../../models';
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
      let userMetadata,
        offerBonus = true;
      const dataToInsert = { deviceId: payload.deviceId };

      if (process.env.NODE_ENV == 'local') {
        userMetadata = { "phoneNumber": '+919875676763' }
      }
      else {
        console.log("---userMetadatauserMetadata---1>>", payload);
        userMetadata = await getMagicTokenIssuer(payload.token);
        console.log("---userMetadatauserMetadata---2>>", userMetadata);
      }

      // const userMetadata = { "phoneNumber": payload.token } //for testing
      /**{
        "issuer": "did:ethr:0x93C81fb56Ad9C4129b2e21C1d4904a6264f7D944",
        "publicAddress": "0x93C81fb56Ad9C4129b2e21C1d4904a6264f7D944",
        "email": null,
        "oauthProvider": null,
        "phoneNumber": "+918968124604"
      } */

      //get current bonus amounts set in the system
      const appConstants = await Db.getDataOne(
        AppConstants,
        {},
        {},
        { lean: true }
      )

      if (payload.deviceId) {
        //check if referral is valid and same device hasn't been used for the same referral code
        if (payload.referredBy) {
          const sameReferralSameDeviceUser = await Db.getDataOne(User,
            { referredBy: payload.referredBy, deviceId: payload.deviceId },
            { _id: 1 },
            { lean: true }
          )

          if (sameReferralSameDeviceUser)
            throw 'This device is already registered through a referral'
          else {
            dataToInsert['referredBy'] = payload.referredBy
          }
        }

        //if another user from same device exists, avoid any bonus
        const anotherUserFromSameDevice = await Db.getDataOne(User,
          { deviceId: payload.deviceId },
          { _id: 1 },
          { lean: true }
        )

        if (anotherUserFromSameDevice) {
          offerBonus = false
        }

      }

      if (userMetadata && userMetadata.phoneNumber) {

        dataToInsert['phone'] = userMetadata.phoneNumber;
        dataToInsert['vipayId'] = userMetadata.phoneNumber + '@vipay';

        if (offerBonus) {
          if (dataToInsert['referredBy'])  //if coming through a valid referral
          {
            dataToInsert['vipayWallet.balance'] = appConstants.joiningBonus + appConstants.refereeBonus
            dataToInsert['referrerBonus'] = appConstants.referrerBonus
          }
          else
            dataToInsert['vipayWallet.balance'] = appConstants.joiningBonus
        }

        const userData = await Db.findAndUpdate(User,
          { phone: userMetadata.phoneNumber },
          { $setOnInsert: dataToInsert },
          { upsert: true, lean: true, new: true })

        userData.token = await generateToken({ _id: userData._id })

        //give referrer bonus
        if (dataToInsert['referredBy'])
          await Db.updateOne(
            User,
            { _id: dataToInsert['referredBy'] },
            { $inc: { 'vipayWallet.balance': appConstants.referrerBonus } },
            { lean: true })

        return userData
      } else
        throw 'Invalid Credentials'

    } catch (err) {
      console.error(JSON.stringify(err));
      throw err
    }
  }
}
