import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';
import Employee from './Employee';

export default class Pay extends ModelBase {
  //Attendance data of employee
  public monthYear!: string;
  public hourPayRate!: number;
  public otPayRate!: number;
  public totalRegularDays!: number;
  public totalExtraDays?: number;
  public totalPhDays?: number;
  public totalToolbox?: number;
  public totalTravel?: number;
  public totalLunchHours?: number;
  public totalOtHours?: number;
  public totalExtraDaysOt?: number;
  public totalPhDaysOt?: number;
  public totalHours!: number;
  public totalRegularPay!: number;
  public totalExtraDaysPay?: number;
  public totalPhDaysPay?: number;
  public totalToolboxPay?: number;
  public totalTravelPay?: number;
  public totalLunchPay?: number;
  public totalOtPay?: number;
  public totalExtraDaysOtPay?: number;
  public totalPhDaysOtPay?: number;
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
        totalRegularDays: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        totalExtraDays: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        totalPhDays: {
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
        totalExtraDaysOt: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalPhDaysOt: {
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
        totalPhDaysPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalToolboxPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalTravelPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalLunchPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalOtPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalExtraDaysOtPay: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalPhDaysOtPay: {
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
        comment: 'Store all of pay per month of employee',
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        schema: 'prismhr2'
      }
    );

    return this;
  }
}
