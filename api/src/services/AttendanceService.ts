import Logger from '../Logger';
import * as AttendanceDao from '../database/dao/AttendanceDao';
import AttendanceNotFountError from '../errors/AttendanceNotFountError';
import { AttendanceResponseModel } from '../typings/ResponseFormats';

const LOG = new Logger('AttendanceService');

/**
 * Search attendance with query and optional pagination
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
export const searchAttendancesWithPagination = async (
  employeeId: string,
  offset: number,
  limit?: number,
  q?: string,
  filterBy?: string,
  startDate?: string,
  endDate?: string
) => {
  LOG.debug('Searching Attendances with Pagination');
  const { rows, count } = await AttendanceDao.getPaginated(employeeId, offset, limit, q, filterBy, startDate, endDate);
  return { rows, count };
};

export const getAttendaceByIdAndShiftDate = async (employeeId: string, shiftDate: string) => {
  LOG.debug('Getting Attendances Data By Employee ID');

  const { rows, count } = await AttendanceDao.getByEmployeeIdAndShiftDate(employeeId, shiftDate);
  return { Attendances: rows, count };
};

export const getTotalWorkDaysInMonth = async (employeeId: string, shiftDate: string) => {
  LOG.debug('Getting Total Work Days In Month Data By Employee ID and shiftDate');

  const count = await AttendanceDao.getTotalWorkDaysInMonth(employeeId, shiftDate);

  return { workDays: count };
};
/**
 * Create new attendances in the system, based on uploaded csv file from user
 *
 * @param attendances is all data of attendances on the csv file
 *
 * @returns AttendancesModel
 */
export const createAttendances = async (attendances: AttendanceResponseModel[]) => {
  LOG.debug('Creating Attendances');

  try {
    for (const attendanceObject of attendances) {
      if (!(await isAttendanceExistByShiftDateAndEmployeeId(attendanceObject.shiftDate, attendanceObject.EmployeeId))) {
        await AttendanceDao.createAttendace(
          attendanceObject.shiftDate,
          attendanceObject.attendanceType,
          attendanceObject.shiftStartTime,
          attendanceObject.shiftEndTime,
          attendanceObject.totalHour,
          attendanceObject.location,
          attendanceObject.EmployeeId
        );
      } else {
        console.log(attendanceObject.attendanceType);
        await editAttendance(
          attendanceObject.shiftDate,
          attendanceObject.attendanceType,
          attendanceObject.shiftStartTime,
          attendanceObject.shiftEndTime,
          attendanceObject.totalHour,
          attendanceObject.location,
          attendanceObject.EmployeeId
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

export const editAttendance = async (
  shiftDate: Date,
  attendanceType: string,
  shiftStartTime: Date,
  shiftEndTime: Date,
  totalHour: number,
  location: string,
  EmployeeId: string
) => {
  LOG.debug('Editing Attendance');

  const attendance = await AttendanceDao.getByShiftDateAndEmployeeIdAndType(shiftDate, EmployeeId, attendanceType);

  if (!attendance) {
    throw new AttendanceNotFountError(EmployeeId);
  }

  try {
    await attendance.update({ shiftDate, attendanceType, shiftStartTime, shiftEndTime, totalHour, location, EmployeeId });
  } catch (err) {
    throw err;
  }
};

export const isAttendanceExistByShiftDateAndEmployeeId = async (shiftDate: Date, EmployeeId: string): Promise<boolean> => {
  return (await AttendanceDao.countByShiftDateAndEmployeeId(shiftDate, EmployeeId)) > 0;
};
