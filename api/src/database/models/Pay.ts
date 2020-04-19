import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';
import Employee from './Employee';

export default class Pay extends ModelBase {
  //Attendance data of employee
  public monthYear!: string;
  public hourPayRate!: number;
  public otPayRate!: number;
  public totalRegularHours!: number;
  public totalExtraDays?: number;
  public totalToolbox?: number;
  public totalTravel?: number;
  public totalLunchHours?: number;
  public totalOtHours?: number;
  public totalHours!: number;
  public totalRegularPay!: number;
  public totalExtraDaysPay?: number;
  public totalOtPay?: number;
  public totalPay!: number;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        monthYear: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        hourPayRate: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        otPayRate: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        totalRegularHours: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        totalExtraDays: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        totalToolbox: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        totalTravel: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalLunchHours: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalOtHours: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalHours: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        totalRegularPay: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        totalExtraDaysPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalOtPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalPay: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        EmployeeId: {
          type: DataTypes.STRING,
          primaryKey: true,
          references: {
            model: Employee,
            key: 'id'
          }
        }
      },
      {
        sequelize,
        tableName: 'Pay',
        freezeTableName: true,
        comment: 'Store all of pay per month of employee'
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'prismhr'
      }
    );

    return this;
  }
}
