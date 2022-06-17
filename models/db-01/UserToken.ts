import {Association, DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {sequelize} from './';
import {UuidUtils} from "../../utils/UuidUtils";
import moment from "moment";
import {User} from "./User";

interface Attributes {
  id?: number;
  created_at?: number;
  expired_at?: number | null;
  user_uuid?: Buffer | undefined;
  token?: string;
  hash?: string;
}

interface CreationAttributes extends Optional<Attributes, "id"> {}

export class UserToken extends Model<Attributes, CreationAttributes> implements Attributes {
  public id!: number;
  public created_at!: number;
  public expired_at!: number;
  public user_uuid!: Buffer;
  public token!: string;
  public hash!: string;

  static associate = (models: any) => {
    User.hasMany(models.UserToken, {
      sourceKey: 'uuid',
      foreignKey: 'user_uuid',
      as: 'tokens',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  public static associations: {
    user: Association<UserToken, User>;
  };
}

// @ts-ignore
UserToken.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
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
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true,
    get() { return this.getDataValue('expired_at') && moment(this.getDataValue('expired_at')).unix() }
  },
  user_uuid: {
    type: 'BINARY(16)',
    allowNull: true,
    comment: '사용자 고유번호',
    get() { // @ts-ignore
      return UuidUtils.toString(this.getDataValue('user_uuid')) },
    set(value: string) { this.setDataValue('user_uuid', UuidUtils.toBuffer(value)) }
  },
}, {
  modelName: 'UserToken',
  tableName: 'user_token',

  timestamps: false,
  underscored: false,
  // updatedAt: 'updated_at',

  charset: 'utf8',
  collate: 'utf8_general_ci',

  sequelize,
});
