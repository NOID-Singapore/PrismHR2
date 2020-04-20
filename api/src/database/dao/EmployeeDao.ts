import { Op, QueryTypes } from 'sequelize';
import { format } from 'date-fns';

import Employee from '../models/Employee';

import { getEmployeeModel } from '../models';
import { sequelize } from '../../config/database';
import { EmployeeDetailsResponseModel } from '../../typings/ResponseFormats';

export const getPaginated = async (offset: number, limit: number, q: string = '') => {
  const [count, rows] = await Promise.all([getCount(q), get(offset, limit, q)]);

  return { rows, count };
};

export const get = async (offset: number, limit: number, q?: string): Promise<EmployeeDetailsResponseModel[]> => {
  const where = generateWhereQuery(q);
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: EmployeeDetailsResponseModel[] = await sequelize.query(
    `SELECT e.*, p."totalRegularDays", p."totalExtraDays", p."totalOtHours", p."totalRegularPay", p."totalExtraDaysPay", p."totalOtPay", p."totalPay"
    FROM prismhr2."Employee" AS e
    LEFT JOIN prismhr2."Pay" AS p ON p."EmployeeId" = e.id
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

export const getCount = async (q?: string): Promise<number> => {
  const where = generateWhereQuery(q);

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

const generateWhereQuery = (q?: string): string => {
  const conditions: string[] = [];

  if (!q) {
    return `AND to_date(p."monthYear",'MM/yyyy') = to_date('${escape(format(new Date(), 'MM/yyyy'))}','MM/yyyy')`;
  }

  if (q) {
    conditions.push(`(e."id" ILIKE '%${q}%' OR e."name" ILIKE '%${q}%')`);
  }

  return `AND to_date(p."monthYear",'MM/yyyy') = to_date('${escape(format(new Date(), 'MM/yyyy'))}','MM/yyyy') WHERE ${conditions.join('')}`;
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
  workHourPerDay: number
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
    workHourPerDay
  });
};
