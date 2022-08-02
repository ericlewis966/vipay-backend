import { User, SupportQueries, SavedWallet, VoucherCodes } from '../../models';
import {
    getMagicTokenIssuer,
    generateToken,
    resizeImageToThumbnail,
    logger
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
                finalResponse = [],
                query = { phone: { $in: allPhoneNumbers } };

            payload.list.forEach(contact => {
                if (contact.phone) {
                    contactMap[contact.phone] = { nameInContacts: contact.name, phoneInContacts: contact.phone };
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
                    contactMap[contactOnboard['phone']] = { ...contactOnboard, ...contactMap[contactOnboard['phone']] }
                })
            }

            for (let contact in contactMap) {
                finalResponse.push(contactMap[contact])
            }

            return finalResponse.sort((a, b) => a.nameInContacts - b.nameInContacts)

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

    static async verifyPin(userAuthData, payload) {
        try {
            const userData = await Db.getDataOne(User,
                { _id: userAuthData._id },
                { pin: 1 },
                { lean: true })

            //compare pin
            if (bcrypt.compareSync(payload.pin, userData.pin))
                return userData
            else
                throw 'Incorrect current PIN'

        } catch (err) {
            console.error(JSON.stringify(err));
            throw err
        }
    }

    static async saveWallet(userAuthData, payload) {
        try {
            const response = await Db.saveData(
                SavedWallet,
                {
                    userId: userAuthData._id,
                    "walletAddress": payload['walletAddress'],
                    "walletLabel": payload['walletLabel'],
                    "network": payload['network']
                }
            );
            return response
        } catch (err) {
            console.error(JSON.stringify(err));
            throw err
        }
    }

    static async listSavedWallet(userAuthData, payload) {
        try {
            const response = await Db.getData(
                SavedWallet,
                {
                    userId: userAuthData._id,
                    "network": payload['network']
                },
                {},
                { lean: true, sort: { createdAt: -1 } }
            );
            return response
        } catch (err) {
            console.error(JSON.stringify(err));
            throw err
        }
    }

    static async raiseSupportQuery(userAuthData, payload) {
        try {
            const response = await Db.saveData(
                SupportQueries,
                {
                    userId: userAuthData._id,
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    message: payload.message
                }
            );
            return response
        } catch (err) {
            logger.error(JSON.stringify(err));
            return Promise.reject(err);
        }
    }

    static async redeemVoucherCode(userAuthData, payload) {
        try {
            const voucher = await Db.getDataOne(
                VoucherCodes,
                {
                    code: payload.code,
                    expiry: { $gte: new Date() },
                    isEnabled: true,
                    usedBy: { '$ne': userAuthData._id }
                },
                { amount: 1 },
                { lean: true }
            );

            //add to vipay wallet
            if (voucher && voucher.amount) {
                await Db.findAndUpdate(
                    User,
                    { _id: userAuthData._id },
                    {
                        '$inc': { 'vipayWallet.balance': voucher.amount }
                    },
                    { lean: true },
                );

                await Db.findAndUpdate(
                    VoucherCodes,
                    { _id: voucher._id },
                    {
                        '$addToSet': { 'usedBy': userAuthData._id }
                    }
                )
            }
            else
                throw 'Invalid Voucher Code'

            return voucher
        } catch (err) {
            logger.error(JSON.stringify(err));
            return Promise.reject(err);
        }
    }
}
