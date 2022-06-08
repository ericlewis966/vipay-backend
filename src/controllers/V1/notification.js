export default class NotificationControllers {
  static async send(payload, userData) {
    try {
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  static async list(payload, userData) {
    try {
      return {
        listing: [],
        count: 0,
      };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}
