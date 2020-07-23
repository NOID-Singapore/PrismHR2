import { Op, QueryTypes } from 'sequelize';
import { format } from 'date-fns';

import Employee from '../models/Employee';

import { getEmployeeModel } from '../models';
import { sequelize } from '../../config/database';
import { EmployeeDetailsResponseModel } from '../../typings/ResponseFormats';

export const getPaginated = async (offset: number, limit: number, q: string = '') => {
  const checkData = await getCount(q, true);

  if (checkData > 0) {
    const [count, rows] = await Promise.all([getCount(q, true), get(offset, limit, q, true)]);
    return { rows, count };
  } else {
    const [count, rows] = await Promise.all([getCount(q, false), get(offset, limit, q, false)]);
    return { rows, count };
  }
};

export const get = async (offset: number, limit: number, q?: string, b?: boolean): Promise<EmployeeDetailsResponseModel[]> => {
  let where = '';
  if (b === true) {
    where = generateWhereQuery(q, true);
  } else {
    where = generateWhereQuery(q, false);
  }
  const offsetAndLimit = generateOffsetAndLimit(offset, limit);

  const result: EmployeeDetailsResponseModel[] = await sequelize.query(
    `SELECT DISTINCT (e.*), a."lunchHours", p."totalRegularDays", p."totalExtraDays",  p."totalPhDays", p."totalOtHours", p."totalExtraDaysOt", p."totalPhDaysOt", p."totalRegularPay", p."totalExtraDaysPay", p."totalPhDaysPay", p."totalToolboxPay", p."totalTravelPay", p."totalLunchPay", p."totalOtPay",  p."totalExtraDaysOtPay", p."totalPhDaysOtPay", p."totalPay"
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

export const getCount = async (q?: string, b?: boolean): Promise<number> => {
  let where = '';
  if (b === true) {
    where = generateWhereQuery(q, true);
  } else {
    where = generateWhereQuery(q, false);
  }

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

const generateWhereQuery = (q?: string, b?: boolean): string => {
  const conditions: string[] = [];

  if (b === true) {
    if (q) {
      conditions.push(
        `(e."id" ILIKE '%${q}%' OR e."name" ILIKE '%${q}%') AND to_date(p."monthYear",'MM/yyyy') = to_date('${escape(
          format(new Date(), 'MM/yyyy')
        )}','MM/yyyy')`
      );
    } else {
      conditions.push(`to_date(p."monthYear",'MM/yyyy') = to_date('${escape(format(new Date(), 'MM/yyyy'))}','MM/yyyy')`);
    }
  } else {
    const thisYear = new Date();
    const getMonthBefore = thisYear.getMonth() - 1;
    const monthBefore = thisYear.setMonth(getMonthBefore);
    if (q) {
      conditions.push(
        `(e."id" ILIKE '%${q}%' OR e."name" ILIKE '%${q}%') AND to_date(p."monthYear",'MM/yyyy') = to_date('${escape(
          format(monthBefore, 'MM/yyyy')
        )}','MM/yyyy')`
      );
    } else {
      conditions.push(`to_date(p."monthYear",'MM/yyyy') = to_date('${escape(format(monthBefore, 'MM/yyyy'))}','MM/yyyy')`);
    }
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
