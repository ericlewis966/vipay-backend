import { User } from '../../models';
import {
    getMagicTokenIssuer,
    generateToken
} from '../../utils/universalFunctions';
import Db from '../../services/queries';

export default class UserControllers {

    static async syncContacts(authData, payload) {
        try {
            const contactMap = {},
                allPhoneNumbers = [],
                query = { phone: { $in: allPhoneNumbers } };

            payload.list.forEach(contact => {
                if (contact.phone) {
                    contactMap[contact.phone] = contact;
                    allPhoneNumbers.push(contact.phone);
                }
            })

            const response = await Db.getData(
                User,
                query,
                {
                    email: 1,
                    name: 1,
                    phone: 1,
                    profilePic: 1
                },
                { lean: true },
            );

            if (response && response[0]) {
                response.forEach(contactOnboard => {
                    contactMap[contactOnboard['phone']] = contactOnboard
                })
            }

            return contactMap
        } catch (err) {
            throw err
        }
    }

    static async editProfile(userAuthData, payload) {
        try {
            const dataToSet = {};

            if ('name' in payload) {
                dataToSet['name'] = payload.name
            }
            if ('profilePicUrl' in payload) {
                dataToSet['profilePic'] = payload.name
            }
            if (payload.emailOTPVerificationDIDToken) {
                const userMetadata = getMagicTokenIssuer(payload.emailOTPVerificationDIDToken);
                dataToSet['email'] = userMetadata.email;
            }
            if (payload.phoneOTPVerificationDIDToken) {
                const userMetadata = getMagicTokenIssuer(payload.phoneOTPVerificationDIDToken);
                dataToSet['phone'] = userMetadata.phone;
            }


            const response = await Db.update(
                User,
                { _id: userAuthData._id },
                {
                    $set: dataToSet
                },
                { lean: true },
            );

            return response
        } catch (err) {
            throw err
        }
    }

    static async uploadImageAndGetUrl(userAuthData, payload) {
        try {
            const dataToSet = {};

            if ('name' in payload) {
                dataToSet['name'] = payload.name
            }
            if ('profilePicUrl' in payload) {
                dataToSet['profilePic'] = payload.name
            }
            if (payload.emailOTPVerificationDIDToken) {
                const userMetadata = getMagicTokenIssuer(payload.emailOTPVerificationDIDToken);
                dataToSet['email'] = userMetadata.email;
            }

            const response = await Db.update(
                User,
                { _id: userAuthData._id },
                {
                    $set: dataToSet
                },
                { lean: true },
            );

            return response
        } catch (err) {
            throw err
        }
    }
}
