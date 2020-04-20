import Logger from '../Logger';
import * as PayDao from '../database/dao/PayDao';
import NeedCalculateError from '../errors/NeedCalculateError';

const LOG = new Logger('PayService');

/**
 * Search pay with query and optional pagination
 *
 * @param eid employee id for pagination search
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 * @param fb filter by for term (shift start time, shift end time)
 * @param sd start date value
 * @param ed end date value
 *
 * @returns the total counts and the data for current page
 */
export const searchPaysWithPagination = async (
  employeeId: string,
  offset: number,
  limit?: number,
  q?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string
) => {
  LOG.debug('Searching Pays with Pagination');
  const { rows, count } = await PayDao.getPaginated(employeeId, offset, limit, q, filterBy, startDate, endDate);
  return { rows, count };
};

export const getPayByEmployeeIdAndPeriod = async (employeeId: string, period: string) => {
  LOG.debug('Getting Pay Data By Employee ID and Period');

  return await PayDao.getPayByEmployeeIdAndPeriod(employeeId, period);
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
  totalHours: number,
  totalRegularPay: number,
  totalExtraDaysPay: number | string,
  totalPhDaysPay: number | string,
  totalOtPay: number | string,
  totalPay: number | string,
  EmployeeId: string
) => {
  LOG.debug('Creating Pay');

  try {
    await PayDao.createPay(
      monthYear,
      hourPayRate,
      otPayRate,
      totalRegularDays,
      totalExtraDays,
      totalPhDays,
      totalToolbox,
      totalTravel,
      totalLunchHours,
      totalOtHours,
      totalHours,
      totalRegularPay,
      totalExtraDaysPay,
      totalPhDaysPay,
      totalOtPay,
      totalPay,
      EmployeeId
    );
  } catch (err) {
    throw err;
  }
};

export const editPay = async (
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
  totalHours: number,
  totalRegularPay: number,
  totalExtraDaysPay: number | string,
  totalPhDaysPay: number | string,
  totalOtPay: number | string,
  totalPay: number | string,
  EmployeeId: string
) => {
  LOG.debug('Editing Pay');

  const pay = await PayDao.getPayByEmployeeIdAndPeriod(EmployeeId, monthYear);

  try {
    await pay.update({
      monthYear,
      hourPayRate,
      otPayRate,
      totalRegularDays,
      totalExtraDays,
      totalPhDays,
      totalToolbox,
      totalTravel,
      totalLunchHours,
      totalOtHours,
      totalHours,
      totalRegularPay,
      totalExtraDaysPay,
      totalPhDaysPay,
      totalOtPay,
      totalPay,
      EmployeeId
    });
  } catch (err) {
    throw err;
  }
};

export const getEmployeePayBySelectedMonth = async (selectedMonth: string) => {
  LOG.debug('Getting All Employee Pay Data With Selected Month By User');

  if (await isPayExistBySelectedMonth(selectedMonth)) {
    return await PayDao.getDataToExport(selectedMonth);
  } else {
    throw new NeedCalculateError();
  }
};

export const isPayExistBySelectedMonth = async (selectedMonth: string): Promise<boolean> => {
  return (await PayDao.countByBySelectedMonth(selectedMonth)) > 0;
};
