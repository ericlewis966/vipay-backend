`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;

const savedWallet = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: '_User'
    },
    walletAddress: String,
    walletLabel: String,
    network: String
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false
  },
);

const SavedWallet = MONGOOSE.model(`savedWallet`, savedWallet);
export default SavedWallet;
