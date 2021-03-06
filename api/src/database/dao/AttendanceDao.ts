import { QueryTypes } from 'sequelize';
import { format } from 'date-fns';
import { sequelize } from '../../config/database';

import { AttendanceResponseModel, EmployeeAttendanceToExportResponseModel, EmployeeAttendanceResponseModel } from '../../typings/ResponseFormats';
import { getAttendanceModel } from '../models';
import Attendance from '../models/Attendance';
import { Op } from 'sequelize';

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
    FROM prismhr2."Attendance"
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
): Promise<AttendanceResponseModel[]> => {
  const where = generateWhereQuery(employeeId, query, filterBy, startDate, endDate);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: AttendanceResponseModel[] = await sequelize.query(
    `SELECT *
    FROM prismhr2."Attendance"
    ${where}
     ORDER BY 
     "shiftDate" DESC
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
    conditions.push(
      `("attendanceType" ILIKE '%${query}%' 
        OR location ILIKE '%${query}%')`
    );
  }

  if (filterBy) {
    conditions.push(
      `"${filterBy}" >= '${escape(format(new Date(startDate), 'yyyy-MM-dd'))}' AND "${filterBy}" <= '${escape(
        format(new Date(endDate), 'yyyy-MM-dd')
      )}'`
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

export const getByEmployeeIdAndShiftDate = async (EmployeeId: string, shiftDate: string) => {
  const model = getAttendanceModel();

  const period = new Date(shiftDate);
  const firstDate = format(new Date(period.getFullYear(), period.getMonth(), 1), 'yyyy-MM-dd');
  const lastDate = format(new Date(period.getFullYear(), period.getMonth() + 1, 0), 'yyyy-MM-dd');
  return model.findAndCountAll({ where: { shiftDate: { [Op.between]: [firstDate, lastDate] }, EmployeeId } });
};

export const getByShiftDateAndEmployeeIdAndType = async (shiftDate: Date, attendanceType: string, shiftStartTime: Date, EmployeeId: string) => {
  const model = getAttendanceModel();

  const shiftDateConvert = format(new Date(shiftDate), 'yyyy-MM-dd');
  const shiftStartTimeConvert = format(new Date(shiftDate + ' ' + shiftStartTime), 'HH:mm:ss');
  return model.findOne<Attendance>({ where: { shiftDate: shiftDateConvert, attendanceType, shiftStartTime: shiftStartTimeConvert, EmployeeId } });
};

export const getTotalWorkDaysInMonth = async (EmployeeId: string, shiftDate: string) => {
  const period = new Date(shiftDate);
  const firstDate = format(new Date(period.getFullYear(), period.getMonth() - 1, 16), 'yyyy-MM-dd');
  const lastDate = format(new Date(period.getFullYear(), period.getMonth(), 15), 'yyyy-MM-dd');
  const result: CountQueryReturn = await sequelize.query(
    `SELECT DISTINCT count(*)
    FROM prismhr2."Attendance"
    WHERE "EmployeeId"= '${EmployeeId}' AND "shiftDate" BETWEEN '${firstDate}' AND '${lastDate}' GROUP BY "attendanceType"`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result[0] === undefined ? 0 : result[0].count;
};

export const getShiftDateInMonthUnique = async (EmployeeId: string, shiftDate: string) => {
  const period = new Date(shiftDate);
  const firstDate = format(new Date(period.getFullYear(), period.getMonth() - 1, 16), 'yyyy-MM-dd');
  const lastDate = format(new Date(period.getFullYear(), period.getMonth(), 15), 'yyyy-MM-dd');
  const result: AttendanceResponseModel[] = await sequelize.query(
    `SELECT DISTINCT "shiftDate", "totalOtHour", "lunchHours", "shiftStartTime", "shiftEndTime"
    FROM prismhr2."Attendance"
    WHERE "EmployeeId"= '${EmployeeId}' AND "shiftDate" BETWEEN '${firstDate}' AND '${lastDate}'`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const countByShiftDateAndEmployeeId = (shiftDate: Date, attendanceType: string, shiftStartTime: Date, EmployeeId: string) => {
  const model = getAttendanceModel();

  const shiftDateConvert = format(new Date(shiftDate), 'yyyy-MM-dd');
  const shiftStartTimeConvert = format(new Date(shiftDate + ' ' + shiftStartTime), 'HH:mm:ss');
  return model.count({ where: { shiftDate: shiftDateConvert, attendanceType, shiftStartTime: shiftStartTimeConvert, EmployeeId } });
};

export const createAttendace = async (
  shiftDate: Date,
  attendanceType: string,
  shiftStartTime: Date,
  shiftEndTime: Date,
  lunchHours: number,
  totalOtHour: number,
  location: string,
  EmployeeId: string
) => {
  const model = getAttendanceModel();

  return model.create<Attendance>({
    shiftDate,
    attendanceType,
    shiftStartTime,
    shiftEndTime,
    lunchHours,
    totalOtHour,
    location,
    EmployeeId
  });
};

export const getEmployeeAttendanceBySelectedMonth = async (selectedMonth: string): Promise<EmployeeAttendanceToExportResponseModel[]> => {
  const result: EmployeeAttendanceToExportResponseModel[] = await sequelize.query(
    `SELECT "shiftDate", "EmployeeId", string_agg("location", ',' order by location) AS "location", string_agg("totalOtHour"::character varying, ',' order by location) AS "totalOtHour"
     FROM prismhr2."Attendance"
     WHERE to_char("shiftDate", 'MM/yyyy') = '${escape(format(new Date(selectedMonth), 'MM/yyyy'))}'
     GROUP BY "shiftDate", "EmployeeId"
     ORDER BY 
     "shiftDate" ASC`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const getByShiftDateAndEmployeeId = async (shiftDate: Date, EmployeeId: string) => {
  const model = getAttendanceModel();

  const shiftDateConvert = format(new Date(shiftDate), 'yyyy-MM-dd');
  return model.findOne<Attendance>({ where: { shiftDate: shiftDateConvert, EmployeeId } });
};

export const getEmployeeAttendanceBySelectedDate = async (selectedDate: string): Promise<EmployeeAttendanceResponseModel[]> => {
  const result: EmployeeAttendanceResponseModel[] = await sequelize.query(
    `SELECT e.name, a.* 
     FROM "Attendance" as a
     INNER JOIN "Employee" as e ON e.ID = a."EmployeeId"
     WHERE to_char("shiftDate", 'dd/MM/yyyy') = '${escape(format(new Date(selectedDate), 'dd/MM/yyyy'))}'`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};
