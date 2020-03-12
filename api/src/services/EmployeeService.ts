import Logger from '../Logger';
import * as EmployeeDao from '../database/dao/EmployeeDao';
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
  return await EmployeeDao.getPaginated(offset, limit, q);
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
  type: string,
  basicSalary: number,
  hourPayRate: number,
  otPayRate: number,
  workHourPerDay: number,
  offDayPerMonth: number
) => {
  LOG.debug('Editing Employee');

  const employee = await EmployeeDao.getById(id);

  if (!employee) {
    throw new EmployeeNotFoundError(id);
  }

  try {
    await employee.update({ name, type, basicSalary, hourPayRate, otPayRate, workHourPerDay, offDayPerMonth });

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
      if (!(await isEmployeeExistsById(employeeObject.id))) {
        await EmployeeDao.createEmployee(
          employeeObject.id,
          employeeObject.name,
          employeeObject.type,
          employeeObject.basicSalary,
          employeeObject.hourPayRate || null,
          employeeObject.otPayRate || null,
          employeeObject.workHourPerDay,
          employeeObject.offDayPerMonth
        );
      } else {
        await editEmployee(
          employeeObject.id,
          employeeObject.name,
          employeeObject.type,
          employeeObject.basicSalary,
          employeeObject.hourPayRate || null,
          employeeObject.otPayRate || null,
          employeeObject.workHourPerDay,
          employeeObject.offDayPerMonth
        );
      }
    }
    const offset = 0;
    const limit = 10;
    return await EmployeeDao.getPaginated(offset, limit);
  } catch (err) {
    throw err;
  }
};

export const isEmployeeExistsById = async (id: string): Promise<boolean> => {
  return (await EmployeeDao.countByById(id)) > 0;
};
