import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';

export default class Holiday extends ModelBase {
  //holiday data
  public id!: number;
  public holidayDate!: Date;
  public descriptions: string;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        holidayDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        descriptions: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: 'Holiday',
        freezeTableName: true,
        comment: 'Store public holiday data',
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        schema: 'prismhr2'
      }
    );
    return this;
  }
}
