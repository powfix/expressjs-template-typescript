import '../../env';
import {Sequelize, Options} from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

export const sequelize = new Sequelize(config);
