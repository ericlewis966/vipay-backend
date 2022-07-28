`use strict`;
/**
 * modules imported here
 **/
import MONGOOSE from 'mongoose';
const Schema = MONGOOSE.Schema;
const appConstants = Schema(
  {
    refereeBonus: { type: Number, default: 50 },
    referrerBonus: { type: Number, default: 50 },
    joiningBonus: { type: Number, default: 50 }
  },
  {
    versionKey: false
  }
);

const AppConstants = MONGOOSE.model(`appConstants`, appConstants);

export default AppConstants;
