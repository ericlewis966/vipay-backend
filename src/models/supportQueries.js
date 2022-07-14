`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;

const supportQueries = Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: '_User'
    },
    name: String,
    phone: String,
    email: String,
    message: String
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    versionKey: false
  },
);

const SupportQueries = MONGOOSE.model(`supportQueries`, supportQueries);

export default SupportQueries;
