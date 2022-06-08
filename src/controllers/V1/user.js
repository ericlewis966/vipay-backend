import { User } from '../../models';
import Db from '../../services/queries';

export default class UserControllers {

    static async syncContacts(payload) {
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
                {},
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
}
