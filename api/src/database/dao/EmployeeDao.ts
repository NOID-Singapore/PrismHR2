import { Op, QueryTypes } from 'sequelize';

import Employee from '../models/Employee';

import { getEmployeeModel } from '../models';
import { sequelize } from '../../config/database';
import { EmployeeDetailsResponseModel } from '../../typings/ResponseFormats';

export const getPaginated = async (offset: number, limit: number, lastMonth: string, q: string = '') => {
  const [count, rows] = await Promise.all([getCount(lastMonth, q), get(offset, limit, lastMonth, q)]);

  return { rows, count };
};

export const get = async (offset: number, limit: number, lastMonth: string, q?: string): Promise<EmployeeDetailsResponseModel[]> => {
  const where = generateWhereQuery(lastMonth, q);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: EmployeeDetailsResponseModel[] = await sequelize.query(
    `SELECT DISTINCT(e.*), a."lunchHours", p."totalRegularDays", p."totalExtraDays",  p."totalPhDays", p."totalOtHours", p."totalExtraDaysOt", p."totalPhDaysOt", p."totalRegularPay", p."totalExtraDaysPay", p."totalPhDaysPay", p."totalToolboxPay", p."totalTravelPay", p."totalLunchPay", p."totalOtPay",  p."totalExtraDaysOtPay", p."totalPhDaysOtPay", p."totalPay"
    FROM prismhr2."Employee" AS e
    LEFT JOIN prismhr2."Pay" AS p ON p."EmployeeId" = e.id
    LEFt JOIN prismhr2."Attendance" AS a ON a."EmployeeId" = e.id
    ${where}
     ORDER BY 
     e."name" ASC
    ${offsetAndLimit}`,
    {
      type: QueryTypes.SELECT
    }
  );

  return result;
};

export const getCount = async (lastMonth: string, q?: string): Promise<number> => {
  const where = generateWhereQuery(lastMonth, q);

  const result: CountQueryReturn = await sequelize.query(
    `SELECT count(*)
    FROM prismhr2."Employee" AS e
    LEFT JOIN prismhr2."Pay" AS p ON p."EmployeeId" = e.id
     ${where}
     `,
    {
      type: QueryTypes.SELECT
    }
  );

  return +result[0].count;
};

const generateWhereQuery = (lastMonth: string, q?: string): string => {
  const conditions: string[] = [];

  if (!q) {
    conditions.push(`p."monthYear" = '${lastMonth}'`);
  }

  if (q) {
    conditions.push(`(e."id" ILIKE '%${q}%' OR e."name" ILIKE '%${q}%') AND p."monthYear" = '${lastMonth}'`);
  }

  return `WHERE ${conditions.join('')}`;
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

export const getEmployee = async (q: string = '') => {
  const model = getEmployeeModel();

  // eslint-disable-next-line
  const where: any = {};

  if (q) {
    where[Op.or] = {
      id: {
        [Op.iLike]: `%${q}%`
      },
      name: {
        [Op.iLike]: `%${q}%`
      }
    };
  }

  return model.findAndCountAll<Employee>({
    where,
    order: [['name', 'ASC']]
  });
};

export const getById = async (id: string) => {
  const model = getEmployeeModel();

  return model.findByPk<Employee>(id);
};

export const countByById = (id: string) => {
  const model = getEmployeeModel();

  return model.count({ where: { id } });
};

export const getAllEmployee = () => {
  const model = getEmployeeModel();
  return model.findAll<Employee>();
};

export const createEmployee = async (
  id: string,
  name: string,
  position: string,
  basicSalary: number,
  hourPayRate: number,
  otherDaysPayRate: number,
  otPayRate: number,
  regularWorkHour: number,
  saturdayWorkHour: number
) => {
  const model = getEmployeeModel();

  return model.create<Employee>({
    id,
    name,
    position,
    basicSalary,
    hourPayRate,
    otherDaysPayRate,
    otPayRate,
    regularWorkHour,
    saturdayWorkHour
  });
};
