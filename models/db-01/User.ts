import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
  Sequelize
} from 'sequelize';
import {sequelize} from './';
import {UuidUtils} from "../../utils/UuidUtils";
import {v4} from 'uuid';
import moment from "moment";
import {UserToken} from "./UserToken";
import {PASSWORD_HASH_MAX_LENGTH, Type, USERNAME_MAX_LENGTH} from "../../constants/user";

interface Attributes {
  uuid?: Buffer;
  id?: number;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
  type?: Type;
  username?: string;
  password?: string;
}

interface CreationAttributes extends Optional<Attributes, "uuid"> {}

export class User extends Model<Attributes, CreationAttributes> implements Attributes {
  public uuid!: Buffer;
  public id!: number;
  public created_at!: number;
  public updated_at!: number | null;
  public deleted_at!: number | null;
  public type!: Type;
  public username!: string;
  public password!: string;

  public getTokens!: HasManyGetAssociationsMixin<UserToken>; // null assertion에주의하십시오!
  public addToken!: HasManyAddAssociationMixin<UserToken, number>;
  public hasToken!: HasManyHasAssociationMixin<UserToken, number>;
  public countTokens!: HasManyCountAssociationsMixin;
  public createToken!: HasManyCreateAssociationMixin<UserToken>;

  public readonly tokens?: UserToken[];

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
    tokens: Association<User, UserToken>;
  };

  public toJWTPayload<T extends Attributes>(): T {
    const attributes = {};

    // @ts-ignore
    for (let key in this.rawAttributes) {
      // @ts-ignore
      attributes[key] = this[key];
    }

    // @ts-ignore
    attributes.password = undefined;

    // @ts-ignore
    return attributes;
  }
}

// @ts-ignore
User.init({
  uuid: {
    primaryKey: true,
    type: 'BINARY(16)',
    allowNull: false,
    unique: true,
    comment: 'UUID(PK)',
    defaultValue: () => UuidUtils.toBuffer(v4()),
    get() { return UuidUtils.toString(this.getDataValue('uuid')) },
    set(value: string) { this.setDataValue('uuid', UuidUtils.toBuffer(value)) },
  },
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
    type: DataTypes.ENUM(Type.ADMINISTRATOR, Type.NORMAL, Type.GUEST),
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
