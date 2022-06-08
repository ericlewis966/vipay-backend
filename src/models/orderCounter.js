`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
import {MODELS_NAME} from '../config/AppConstraints';
const Schema = MONGOOSE.Schema;

const ordercounter = Schema(
  {
    count: {type: Number, required: true},
    userNumber: {type: String, default: ''},
    date: {type: String, default: ''},
    type: {
      type: String,
      required: true,
      enum: [MODELS_NAME.USER],
      default: MODELS_NAME.USER,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const OrderCounter = MONGOOSE.model(`ordercounter`, ordercounter);

export default OrderCounter;
