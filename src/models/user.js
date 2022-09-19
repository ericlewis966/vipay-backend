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
    referredBy: {
      type: Schema.ObjectId,
      ref: '_User'
    },
    referrerBonus: Number,
    deviceId: { type: String, index: true },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, index: true, sparse: true },
    // _acl : Object,
    profilePic: String,
    enable: { type: Boolean, index: true, sparse: true, default: true },
    pin: { type: String, default: null, index: true },
    ucid: { type: String, index: true, sparse: true },
    roleId: { type: String, index: true, sparse: true },
    isUserLoggedIn: { type: Boolean, index: true, sparse: true, default: false },
    lastOnline: { type: Number, default: 0, default: 4 },
    loginAtempts: [loginAt],
    vipayId: { type: String, unique: true },
    vipayWallet: {
      balance: { type: Number, default: 0 },
      isDisplayed: { type: Boolean, default: true }
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
