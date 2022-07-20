`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;

const loginAt = {
  loginTime: { type: Date, default: new Date() },
  deviceName: { type: String, default: 'WEB' },
  deviceToken: { type: String, default: '' },
  remoteAddress: { type: String, default: '' },
};

const user = Schema(
  {
    phone: { type: String, unique: true },
    referalCode: { type: String, index: true, sparse: true, default: "Vi" },
    referedBy: [{ type: String, index: true, sparse: true }],
    deviceId: { type: String, index: true, sparse: true, default: "Vi" },
    email: { type: String, unique: true},
    name: { type: String, index: true, sparse: true, default: "Vi" },
    // _acl : Object,
    profilePic: { data: Buffer, contentType: String },
    enable: { type: Boolean, index: true, sparse: true, default: true },
    pin: { type: String, index: true},
    ucid: { type: String, index: true, sparse: true, default: "Vi" },
    roleId: { type: String, index: true, sparse: true, default: "Vi" },
    isUserLoggedIn: { type: Boolean, index: true, sparse: true, default: false },
    lastOnline: { type: Number, default: 0, default: 4 },
    loginAtempts: [loginAt],
    vipayWallet: {
      balance: {type: Number, default: 0},
      isDisplayed: {type: Boolean, default: true}
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false
  },
);

const User = MONGOOSE.model(`users`, user, '_User');
export default User;
