import { QueryTypes } from 'sequelize';
import { format } from 'date-fns';
import { sequelize } from '../../config/database';

import { PayResponseModel } from '../../typings/ResponseFormats';
import Pay from '../models/Pay';
import { getPayModel } from '../models';
import { EmployeeDetailsPayResponseModel } from '../../typings/ResponseFormats';
import { getEmployeeAttendanceBySelectedMonth } from './AttendanceDao';

export const getPaginated = async (
  employeeId: string,
  offset: number,
  limit: number,
  query?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string
) => {
  const [count, rows] = await Promise.all([
    getCount(employeeId, query, filterBy, startDate, endDate),
    get(employeeId, offset, limit, query, filterBy, startDate, endDate)
  ]);

  return { count, rows };
};

export const getCount = async (employeeId: string, query?: string, filterBy?: string, startDate?: string, endDate?: string): Promise<number> => {
  const where = generateWhereQuery(employeeId, query, filterBy, startDate, endDate);

  const result: CountQueryReturn = await sequelize.query(
    `SELECT count(*)
    FROM prismhr2."Pay"
    ${where}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return +result[0].count;
};

export const get = async (
  employeeId: string,
  offset: number,
  limit: number,
  query?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string
): Promise<PayResponseModel[]> => {
  const where = generateWhereQuery(employeeId, query, filterBy, startDate, endDate);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: PayResponseModel[] = await sequelize.query(
    `SELECT *
    FROM prismhr2."Pay"
    ${where}
     ORDER BY 
     "monthYear" DESC
    ${offsetAndLimit}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

const generateWhereQuery = (employeeId: string, query?: string, filterBy?: string, startDate?: string, endDate?: string): string => {
  const conditions: string[] = [];

  if (!query && !filterBy) {
    return `WHERE "EmployeeId" = '${employeeId}'`;
  }

  if (query) {
    conditions.push(`("monthYear" ILIKE '%${query}%')`);
  }

  if (filterBy) {
    conditions.push(
      `to_date("${filterBy}",'MM/yyyy') >= to_date('${escape(
        format(new Date(startDate), 'MM/yyyy')
      )}','MM/yyyy') AND to_date("${filterBy}",'MM/yyyy') <= to_date('${escape(format(new Date(endDate), 'MM/yyyy'))}','MM/yyyy')`
    );
  }

  return `WHERE "EmployeeId" = '${employeeId}' AND ${conditions.join(' AND ')}`;
};

const generateOffsetAndLimit = (offset?: number, limit?: number): string => {
  if (offset === undefined) {
    return '';
  }

  let offsetAndLimit = `OFFSET ${offset}`;

  if (limit !== undefined) {
    offsetAndLimit += ` LIMIT ${limit}`;
  }

  return offsetAndLimit;
};

export const getPayByEmployeeIdAndPeriod = async (EmployeeId: string, period: string) => {
  const model = getPayModel();

  const monthYear = format(new Date(period), 'MM/yyyy');
  return model.findOne({ where: { monthYear, EmployeeId } });
};

export const createPay = async (
  monthYear: string,
  hourPayRate: number,
  otPayRate: number,
  totalRegularDays: number,
  totalExtraDays: number,
  totalPhDays: number,
  totalToolbox: number | string,
  totalTravel: number | string,
  totalLunchHours: number | string,
  totalOtHours: number,
  totalExtraDaysOt: number,
  totalPhDaysOt: number,
  totalHours: number,
  totalRegularPay: number,
  totalExtraDaysPay: number | string,
  totalPhDaysPay: number | string,
  totalToolboxPay: number | string,
  totalTravelPay: number | string,
  totalLunchPay: number | string,
  totalOtPay: number | string,
  totalExtraDaysOtPay: number | string,
  totalPhDaysOtPay: number | string,
  totalPay: number | string,
  EmployeeId: string
) => {
  const model = getPayModel();

  return model.create<Pay>({
    monthYear: format(new Date(monthYear), 'MM/yyyy'),
    hourPayRate,
    otPayRate,
    totalRegularDays,
    totalExtraDays,
    totalPhDays,
    totalToolbox,
    totalTravel,
    totalLunchHours,
    totalOtHours,
    totalExtraDaysOt,
    totalPhDaysOt,
    totalHours,
    totalRegularPay,
    totalExtraDaysPay,
    totalPhDaysPay,
    totalToolboxPay,
    totalTravelPay,
    totalLunchPay,
    totalOtPay,
    totalExtraDaysOtPay,
    totalPhDaysOtPay,
    totalPay,
    EmployeeId
  });
};

export const getDataToExport = async (selectedMonth: string) => {
  const [employeePay, employeeAttendance] = await Promise.all([
    getEmployeePayBySelectedMonth(selectedMonth),
    getEmployeeAttendanceBySelectedMonth(selectedMonth)
  ]);

  return { employeePay, employeeAttendance };
};

export const getEmployeePayBySelectedMonth = async (selectedMonth: string): Promise<EmployeeDetailsPayResponseModel[]> => {
  const result: EmployeeDetailsPayResponseModel[] = await sequelize.query(
    `SELECT e.id, e.name, e.position, e."basicSalary", p."monthYear", p."hourPayRate", p."otPayRate", p."totalRegularDays", p."totalExtraDays", p."totalPhDays", p."totalToolbox", p."totalTravel", p."totalLunchHours", p."totalOtHours", p."totalExtraDaysOt", p."totalPhDaysOt", p."totalRegularPay", p."totalExtraDaysPay", p."totalPhDaysPay", p."totalToolboxPay", p."totalTravelPay", p."totalLunchPay", p."totalOtPay", p."totalExtraDaysOtPay", p."totalPhDaysOtPay", p."totalPay"
    FROM prismhr2."Employee" AS e
    LEFT JOIN prismhr2."Pay" AS p ON p."EmployeeId" = e.id
    AND to_date(p."monthYear",'MM/yyyy') = to_date('${escape(format(new Date(selectedMonth), 'MM/yyyy'))}','MM/yyyy')
     ORDER BY 
     e."name" ASC`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const countByBySelectedMonth = (selectedMonth: string) => {
  const model = getPayModel();
  const monthYear = format(new Date(selectedMonth), 'MM/yyyy');
  return model.count({ where: { monthYear } });
};

export const getPayLastMonth = () => {
  const model = getPayModel();

  return model.findOne({ order: [['monthYear', 'DESC']] });
};
