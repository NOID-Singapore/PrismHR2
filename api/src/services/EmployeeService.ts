import Logger from '../Logger';
import * as EmployeeDao from '../database/dao/EmployeeDao';
import * as PayDao from '../database/dao/PayDao';
import EmployeeNotFoundError from '../errors/EmployeeNotFoundError';
import Employee from '../database/models/Employee';

import { EmployeeResponseModel } from '../typings/ResponseFormats';

const LOG = new Logger('EmployeeService');

export const globalSearchEmployees = async (q?: string) => {
  return await EmployeeDao.getEmployee(q);
};

/**
 * Search Employee with query and optional pagination
 *
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 *
 * @returns the total counts and the data for current page
 */
export const searchEmployeesWithPagination = async (offset: number, limit?: number, q?: string) => {
  LOG.debug('Searching Employees with Pagination');
  const payLastMonth = await PayDao.getPayLastMonth();
  const lastMonth = payLastMonth !== null ? payLastMonth.getDataValue('monthYear') : '';
  return await EmployeeDao.getPaginated(offset, limit, lastMonth, q);
};

/**
 * Search Employee with id as query
 *
 * @param employeeId is id from employee
 *
 * @returns the employee data
 */
export const getEmployeeById = async (employeeId: string): Promise<Employee> => {
  LOG.debug('Getting Employee by employee ID');

  return EmployeeDao.getById(employeeId);
};

export const getEmployeeFullDetailsById = async (id: string): Promise<EmployeeResponseModel> => {
  LOG.debug('Getting Employee full details from id');

  const employee = await EmployeeDao.getById(id);

  if (!employee) {
    throw new EmployeeNotFoundError(id);
  }

  return employee.toResponseFormat();
};

export const getAllEmployee = async () => {
  LOG.debug('Getting All Employee');

  return await EmployeeDao.getAllEmployee();
};

/**
 * To Edit a employee in the system, based on user choose and inputed new data
 *
 * @param id of the employee
 * @param regularPayRate of the employee
 * @param otPayRate of the employee
 *
 * @returns void
 */
export const editEmployee = async (
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
  LOG.debug('Editing Employee');

  const employee = await EmployeeDao.getById(id);

  if (!employee) {
    throw new EmployeeNotFoundError(id);
  }

  try {
    await employee.update({ name, position, basicSalary, hourPayRate, otherDaysPayRate, otPayRate, regularWorkHour, saturdayWorkHour });

    return await getEmployeeFullDetailsById(id);
  } catch (err) {
    throw err;
  }
};

/**
 * Create new employees in the system, based on uploaded csv file from user
 *
 * @param employees is all data of employee on the csv file
 *
 * @returns EmployeesModel
 */
export const createEmployees = async (employees: EmployeeResponseModel[]) => {
  LOG.debug('Creating Employee');

  try {
    for (const employeeObject of employees) {
      const otRate =
        employeeObject.basicSalary === 814
          ? 6.41
          : (
              Number(
                Number(((employeeObject.basicSalary * 12) / (52 * 44)).toFixed(3)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ) * 1.5
            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (!(await isEmployeeExistsById(employeeObject.id))) {
        await EmployeeDao.createEmployee(
          employeeObject.id,
          employeeObject.name,
          employeeObject.position,
          employeeObject.basicSalary,
          employeeObject.hourPayRate || null,
          employeeObject.otherDaysPayRate || null,
          Number(otRate) || null,
          employeeObject.regularWorkHour,
          employeeObject.saturdayWorkHour
        );
      } else {
        await editEmployee(
          employeeObject.id,
          employeeObject.name,
          employeeObject.position,
          employeeObject.basicSalary,
          employeeObject.hourPayRate || null,
          employeeObject.otherDaysPayRate || null,
          Number(otRate) || null,
          employeeObject.regularWorkHour,
          employeeObject.saturdayWorkHour
        );
      }
    }
    const offset = 0;
    const limit = 10;
    const payLastMonth = await PayDao.getPayLastMonth();
    const lastMonth = payLastMonth !== null ? payLastMonth.getDataValue('monthYear') : '';
    return await EmployeeDao.getPaginated(offset, limit, lastMonth);
  } catch (err) {
    throw err;
  }
};

export const isEmployeeExistsById = async (id: string): Promise<boolean> => {
  return (await EmployeeDao.countByById(id)) > 0;
};
