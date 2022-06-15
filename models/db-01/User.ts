import {DataTypes, Model, Sequelize} from 'sequelize';
import {sequelize} from './';
import {PASSWORD_HASH_MAX_LENGTH, Type, USERNAME_MAX_LENGTH} from "../../constants/User";
import {v4} from 'uuid';
import {UuidUtils} from "../../utils/UuidUtils";
import moment from "moment";

interface Attributes {
  uuid: BinaryType;
  id: number;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  type: Type;
  username: string;
  password: string | null;
}

export class User extends Model<Attributes> {
  public readonly uuid: BinaryType;
  public readonly id: number;
  public created_at: Date;
  public updated_at!: Date;
  public deleted_at!: Date;
  public type: Type;
  public username: string;
  public password: string;

  public static associations: {

  };
}

// @ts-ignore
User.init({
  uuid: {
    type: 'BINARY(16)',
    primaryKey: true,
    comment: '고유번호(UUID)',
    defaultValue: () => UuidUtils.toBuffer(v4()),
  },
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ORDER & PAGINATION',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
    get() { return this.getDataValue('created_at') && moment(this.getDataValue('created_at')).unix() }
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    get() { return this.getDataValue('updated_at') && moment(this.getDataValue('updated_at')).unix() }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    get() { return this.getDataValue('deleted_at') && moment(this.getDataValue('deleted_at')).unix() }
  },
  type: {
    type: DataTypes.ENUM(Type.SUPER_USER, Type.NORMAL, Type.GUEST),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(USERNAME_MAX_LENGTH),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(PASSWORD_HASH_MAX_LENGTH),
    allowNull: false,
  },
}, {
  modelName: 'User',
  tableName: 'user',

  timestamps: false,
  underscored: false,
  updatedAt: 'updated_at',

  charset: 'utf8',
  collate: 'utf8_general_ci',

  sequelize,
});
