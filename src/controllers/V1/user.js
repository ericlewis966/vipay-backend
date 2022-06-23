import { User } from '../../models';
import {
    getMagicTokenIssuer,
    generateToken,
    resizeImageToThumbnail
} from '../../utils/universalFunctions';
import Db from '../../services/queries';
import { fstat } from 'fs';
import bcrypt from 'bcrypt';
import {
    SERVER,
    USER_TYPE,
    LANGUAGE,
    STATUS_MSG,
    COMMON_STATUS,
    MODELS_NAME,
} from '../../config/AppConstraints';

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
                const userMetadata = await getMagicTokenIssuer(payload.emailOTPVerificationDIDToken);
                dataToSet['email'] = userMetadata.email;
            }
            if (payload.phoneOTPVerificationDIDToken) {
                const userMetadata = await getMagicTokenIssuer(payload.phoneOTPVerificationDIDToken);
                dataToSet['phone'] = userMetadata.phone;
            }

            if (payload.profilePic) {
                const buffer = await resizeImageToThumbnail(payload.profilePic.path);
                dataToSet['profilePic'] = {
                    data: buffer,
                    contentType: payload.profilePic.headers['content-type']
                }
            }

            const response = await Db.findAndUpdate(
                User,
                { _id: userAuthData._id },
                {
                    $set: dataToSet
                },
                { lean: true, new: true },
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

    static async setPin(userAuthData, payload) {
        try {
            const response = await Db.findAndUpdate(User,
                { _id: userAuthData._id },
                { $set: { pin: bcrypt.hashSync(payload.pin, SERVER.SALT) } },
                { lean: true, new: true })

            if (response)
                return true
            else
                return false
        } catch (err) {
            console.error(JSON.stringify(err));
            throw err
        }
    }

    static async changePin(userAuthData, payload) {
        try {
            const userData = await Db.getDataOne(User,
                { _id: userAuthData._id },
                { pin: 1 },
                { lean: true })

            let response
            //compare old pin
            if (bcrypt.compareSync(payload.oldPin, userData.pin)) {

                //set new pin
                response = await Db.findAndUpdate(User,
                    { _id: userAuthData._id },
                    { $set: { pin: bcrypt.hashSync(payload.newPin, SERVER.SALT) } },
                    { new: true })
            } else {
                throw 'Incorrect current PIN'
            }

            return response
        } catch (err) {
            console.error(JSON.stringify(err));
            throw err
        }
    }
}
