import {
  Association,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Sequelize
} from 'sequelize';
import { Models } from '../typings/Models';
import { EmployeeResponseModel } from '../../typings/ResponseFormats';

import ModelBase from './ModelBase';
import Attendance from './Attendance';
import Pay from './Pay';

export default class Employee extends ModelBase {
  //employee personal data
  public id!: string;
  public name!: string;
  public position?: string;
  public basicSalary!: number;
  public hourPayRate?: number;
  public otherDaysPayRate?: number;
  public otPayRate?: number;
  public workHourPerDay!: number;

  // timestamp
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Auto generated methods from associations
  public getAttendances!: HasManyGetAssociationsMixin<Attendance>;
  public addAttendance!: HasManyAddAssociationMixin<Attendance, Date>;
  public addAttendances!: HasManyAddAssociationsMixin<Attendance, Date>;
  public countAttendance!: HasManyCountAssociationsMixin;
  public createAttendance!: HasManyCreateAssociationMixin<Attendance>;
  public hasAttendance!: HasManyHasAssociationMixin<Attendance, Date>;
  public hasAttendances!: HasManyHasAssociationsMixin<Attendance, Date>;
  public removeAttendance!: HasManyRemoveAssociationMixin<Attendance, Date>;
  public removeAttendances!: HasManyRemoveAssociationsMixin<Attendance, Date>;
  public setAttendances!: HasManySetAssociationsMixin<Attendance, Date>;

  public getPays!: HasManyGetAssociationsMixin<Pay>;
  public addPay!: HasManyAddAssociationMixin<Pay, string>;
  public addPays!: HasManyAddAssociationsMixin<Pay, string>;
  public countPay!: HasManyCountAssociationsMixin;
  public createPay!: HasManyCreateAssociationMixin<Pay>;
  public hasPay!: HasManyHasAssociationMixin<Pay, string>;
  public hasPays!: HasManyHasAssociationsMixin<Pay, string>;
  public removePay!: HasManyRemoveAssociationMixin<Pay, string>;
  public removePays!: HasManyRemoveAssociationsMixin<Pay, string>;
  public setPays!: HasManySetAssociationsMixin<Pay, string>;

  public static associations: {
    attendances: Association<Employee, Attendance>;
    pays: Association<Employee, Pay>;
  };

  public static associate(models: Models) {
    Employee.hasMany(models.Attendance, { onDelete: 'CASCADE' });
    Employee.hasMany(models.Pay, { onDelete: 'CASCADE' });
  }

  public static initModel(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        position: {
          type: DataTypes.STRING,
          allowNull: false
        },
        basicSalary: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        hourPayRate: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        otherDaysPayRate: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        otPayRate: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
        workHourPerDay: {
          type: DataTypes.FLOAT,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Employee',
        freezeTableName: true,
        comment: 'Store all of employee data',
        // DON'T REMOVE THIS COMMENT IF YOU DON'T WANT TO RESYNC/INIT DATABASE
        schema: 'prismhr2'
      }
    );

    return this;
  }

  public toResponseFormat(): EmployeeResponseModel {
    const { id, name, position, basicSalary, hourPayRate, otherDaysPayRate, otPayRate, workHourPerDay, createdAt, updatedAt } = this;

    return { id, name, position, basicSalary, hourPayRate, otherDaysPayRate, otPayRate, workHourPerDay, createdAt, updatedAt };
  }
}
