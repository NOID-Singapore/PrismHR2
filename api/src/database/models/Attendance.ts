import { DataTypes, Sequelize } from 'sequelize';

import ModelBase from './ModelBase';
import Employee from './Employee';
import { AttendanceResponseModel } from '../../typings/ResponseFormats';

export enum AttendanceType {
  SATS = 'SATS',
  DESKERA = 'DESKERA'
}

export default class Attendance extends ModelBase {
  //Attendance data of employee
  public shiftDate!: Date;
  public attendanceType!: AttendanceType;
  public shiftStartTime!: Date;
  public shiftEndTime!: Date;
  public toolbox?: number;
  public travel?: number;
  public lunchHours?: number;

  public totalOTHour!: number;
  public location?: string;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        shiftDate: {
          type: DataTypes.DATEONLY,
          primaryKey: true
        },
        attendanceType: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        shiftStartTime: {
          type: DataTypes.TIME,
          primaryKey: true
        },
        shiftEndTime: {
          type: DataTypes.TIME,
          allowNull: false
        },
        toolbox: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        travel: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        lunchHours: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        totalOTHour: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null
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
        tableName: 'Attendance',
        freezeTableName: true,
        comment: 'Store all of attendance of employee'
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        // schema: 'prismhr'
      }
    );

    return this;
  }

  public toResponseFormat(): AttendanceResponseModel {
    const {
      shiftDate,
      attendanceType,
      shiftStartTime,
      shiftEndTime,
      toolbox,
      travel,
      lunchHours,
      totalOTHour,
      location,
      createdAt,
      updatedAt
    } = this;

    return {
      shiftDate,
      attendanceType,
      shiftStartTime,
      shiftEndTime,
      toolbox,
      travel,
      lunchHours,
      totalOTHour,
      location,
      createdAt,
      updatedAt
    };
  }
}
