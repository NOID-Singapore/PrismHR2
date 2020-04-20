import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';
import { UserResponseModel } from '../../typings/ResponseFormats';

export default class User extends ModelBase {
  public id!: number;
  public loginName!: string;
  public password!: string;
  public active!: boolean;
  public displayName!: string;
  public email!: string;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        loginName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        tableName: 'User',
        freezeTableName: true,
        comment: 'User stores all user information',
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        schema: 'prismhr2'
      }
    );

    return this;
  }

  public toResponseFormat(): UserResponseModel {
    const { id, loginName, displayName, email } = this;

    return {
      id,
      loginName,
      displayName,
      email
    };
  }
}
