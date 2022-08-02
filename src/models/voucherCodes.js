`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;

const voucherCodes = Schema(
  {
    amount: { type: Number, required: true },
    expiry: { type: Date, required: true },
    isEnabled: { type: Boolean, default: true },
    code: { type: String, required: true },
    usedBy: [{
      type: Schema.ObjectId,
      ref: '_User'
    }],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false
  },
);

const VoucherCodes = MONGOOSE.model(`voucherCodes`, voucherCodes);
export default VoucherCodes;
