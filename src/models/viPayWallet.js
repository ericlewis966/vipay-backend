`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;

const vipaywallet = Schema(
  {
    userId: {type: String, index: true, sparse: true},
    balance: {type: Number, index: true, sparse: true},
    display: {type: Boolean, index: true, sparse: true},
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
const Vipaywallet = MONGOOSE.model(`vipaywallet`, vipaywallet);
export default Vipaywallet;
