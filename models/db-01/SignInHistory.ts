import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {sequelize} from './';
import moment from "moment";
import {USERNAME_MAX_LENGTH} from '../../constants/user';
import {STATUS} from "../../constants/sign-in-history";

interface Attributes {
  id?: number;
  created_at?: number;
  status?: STATUS;
  username?: string;
  ipv4?: string | null;
  ipv6?: string | null;
  useragent?: string | null;
}

interface CreationAttributes extends Optional<Attributes, "id"> {}

export class SignInHistory extends Model<Attributes, CreationAttributes> implements Attributes {
  public id!: number;
  public created_at!: number;
  public status!: STATUS;
  public username!: string;
  public ipv4!: string;
  public ipv6!: string;
  public useragent!: string;

  public static associations: {

  };
}

// @ts-ignore
SignInHistory.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true,
    comment: 'Numeric ID(PK)',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
    get() { return this.getDataValue('created_at') && moment(this.getDataValue('created_at')).unix() }
  },
  status: {
    type: DataTypes.ENUM(
      STATUS.PROCESSING,
      STATUS.SUCCESS,
      STATUS.FAILED,
    ),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(USERNAME_MAX_LENGTH),
    allowNull: false,
  },
}, {
  modelName: 'SignInHistory',
  tableName: 'sign_in_history',

  timestamps: false,
  underscored: false,

  charset: 'utf8',
  collate: 'utf8_general_ci',

  sequelize,
});
