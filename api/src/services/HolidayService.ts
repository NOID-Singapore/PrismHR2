import Logger from '../Logger';
import * as HolidayDao from '../database/dao/HolidayDao';
import HolidayNotFoundError from '../errors/HolidayNotFoundError';

const LOG = new Logger('HolidayService.ts');

/**
 * Search holiday with query and optional pagination
 *
 * @param s offset for pagination search
 * @param l limit for pagination search
 * @param q query for searching
 *
 * @returns the total counts and the data for current page
 */
export const searchHolidaysWithPagination = async (offset: number, limit?: number, q?: string) => {
  LOG.debug('Searching Holidays with Pagination');

  const { rows, count } = await HolidayDao.getPaginated(offset, limit, q);

  return { rows, count };
};

export const getAllHoliday = async () => {
  LOG.debug('Get all Holiday data');

  const { rows } = await HolidayDao.getAll();

  return { holidays: rows };
};

/**
 * Create a new holiday in the system
 *
 * @param holidayDate of the new holiday
 * @param descriptions of the new holiday
 *
 * @returns HolidayModel
 */
export const createHoliday = async (holidayDate: Date, descriptions: string) => {
  LOG.debug('Creating Holiday');

  try {
    const holiday = await HolidayDao.createHoliday(holidayDate, descriptions);

    return holiday;
  } catch (err) {
    throw err;
  }
};

/**
 * Edit a holiday in the system
 *
 * @param holidayDate of the holiday
 * @param descriptions of the holiday
 *
 * @returns HolidayModel
 */
export const editHoliday = async (holidayId: number, holidayDate: Date, descriptions: string) => {
  LOG.debug('Editing Holiday');

  const holiday = await HolidayDao.getById(holidayId);

  if (!holidayId) {
    throw new HolidayNotFoundError(holidayId);
  }

  try {
    await holiday.update({ holidayDate, descriptions });
    return holiday;
  } catch (err) {
    throw err;
  }
};

export const deleteHoliday = async (id: number) => {
  await HolidayDao.deleteHoliday(id);
};
