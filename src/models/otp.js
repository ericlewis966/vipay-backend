`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
import {COMMON_STATUS} from '../config/AppConstraints';
const Schema = MONGOOSE.Schema;
const otp = Schema(
  {
    otp: {type: String, required: true, index: true},
    mobileNumber: {type: String, index: true, sparse: true, default: ''},
    status: {
      type: String,
      default: COMMON_STATUS.ACTIVE,
      enum: [
        COMMON_STATUS.ACTIVE,
        COMMON_STATUS.INACTIVE,
        COMMON_STATUS.DELETED,
      ],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const Otp = MONGOOSE.model(`otp`, otp);

export default Otp;
