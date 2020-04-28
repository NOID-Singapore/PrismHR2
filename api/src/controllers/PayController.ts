import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import { Authentication } from '../config/passport';

import Logger from '../Logger';
import * as PayService from '../services/PayService';
import * as EmployeeService from '../services/EmployeeService';
import * as AttendanceService from '../services/AttendanceService';
import * as HolidayService from '../services/HolidayService';

const PayController = express.Router();
const LOG = new Logger('PayController.ts');

interface SearchPayQueryParams {
  eid: string; // employee id for pagination search
  s: number; // offset for pagination search
  l?: number; // limit for pagination search
  q?: string; // query for searching
  fb?: string; // filter by for term (shift start time, shift end time)
  sd?: string; // start date value
  ed?: string; // end date value
}

const searchPayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eid, s, l, q, fb, sd, ed }: SearchPayQueryParams = req.query;

    const { rows, count } = await PayService.searchPaysWithPagination(eid, s, l, q, fb, sd, ed);

    return res.status(OK).json({
      count,
      payHistories: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const calculatePayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { selectedMonth } = req.body;
    const employees = await EmployeeService.getAllEmployee();

    //get holidays date data
    const { holidays } = await HolidayService.getAllHoliday();
    const holidayArray: any = [];
    holidays.map(holiday => {
      holidayArray.push(holiday.getDataValue('holidayDate'));
    });

    const promises = employees.map(async employee => {
      const payData = await PayService.getPayByEmployeeIdAndPeriod(employee.getDataValue('id'), selectedMonth);

      //a basic salary
      const basicSalary = employee.getDataValue('basicSalary');

      //b sunday/ph pay rate
      const otherDaysPayRate = employee.getDataValue('otherDaysPayRate');

      //c ot rate
      const otPayRate = Number((((basicSalary * 12) / (52 * 44)) * 1.5).toFixed(2));

      //totalRegularDays
      let totalRegularDays = 0;

      //totalExtraDays
      let totalExtraDays = 0;

      //totalPhDays
      let totalPhDays = 0;

      //totalToolbox
      let totalToolbox = 0;

      //totalTravel
      let totalTravel = 0;

      //totalLunchHours
      let totalLunchHours = 0;

      //totalOtHours
      let totalOtHours = 0;

      //totalExtraDaysOt
      let totalExtraDaysOt = 0;

      //totalPhDaysOt
      let totalPhDaysOt = 0;

      //totalRegularPay
      let totalRegularPay = 0;

      //totalExtraDaysPay
      let totalExtraDaysPay = 0;

      //totalPhDaysPay
      let totalPhDaysPay = 0;

      //totalRegOt
      let totalOtPay = 0;

      //totalExtraDaysOtPay
      let totalExtraDaysOtPay = 0;

      //totalPhDaysOtPay
      let totalPhDaysOtPay = 0;

      //d additonal pay
      let additonalPay = 0;

      //f regular work hours
      // const regularWorkHours = employee.getDataValue('workHourPerDay');

      //Unique Shift Date Attendance
      const { AttendanceShiftDate } = await AttendanceService.getAttendaceByIdAndShiftDateUnique(employee.getDataValue('id'), selectedMonth);

      if (holidayArray.length > 0) {
        holidayArray.map((holiday: any) => {
          AttendanceShiftDate.map(attendance => {
            const convertToDate = new Date(attendance.shiftDate);
            const getDay = convertToDate.getDay();
            if (getDay === 0) {
              totalExtraDays++;
              totalExtraDaysOt = totalExtraDaysOt + attendance.totalOtHour;
              totalExtraDaysPay = totalExtraDaysPay + otherDaysPayRate;
              totalExtraDaysOtPay = totalExtraDaysOtPay + attendance.totalOtHour * otPayRate;
            } else if (attendance.shiftDate === holiday) {
              totalPhDays++;
              totalPhDaysOtPay = totalPhDaysOtPay + attendance.totalOtHour;
              totalPhDaysPay = totalPhDaysPay + otherDaysPayRate;
              totalPhDaysOtPay = totalPhDaysOtPay + attendance.totalOtHour * otPayRate;
            } else {
              totalRegularDays++;
              if (attendance.totalOtHour > 1.3) {
                totalToolbox = totalToolbox + 1;
                totalTravel = totalTravel + 0.3;
                const lunchHours = attendance.lunchHours === undefined ? 0 : attendance.lunchHours;
                totalLunchHours = totalLunchHours + lunchHours;
                const otHours = attendance.totalOtHour - 1 - 0.3 - lunchHours;
                totalOtHours = totalOtHours + otHours;
                totalOtPay = totalOtPay + otHours * otPayRate;
                totalRegularPay = totalRegularPay + otHours * otPayRate;
              } else {
                totalToolbox = totalToolbox + attendance.totalOtHour;
                totalOtHours = totalOtHours + attendance.totalOtHour;
                totalOtPay = totalOtPay + attendance.totalOtHour * otPayRate;
                totalRegularPay = totalRegularPay + attendance.totalOtHour * otPayRate;
              }
            }
          });
        });
      } else {
        AttendanceShiftDate.map(attendance => {
          const convertToDate = new Date(attendance.shiftDate);
          const getDay = convertToDate.getDay();
          if (getDay === 0) {
            totalExtraDays++;
            totalExtraDaysOt = totalExtraDaysOt + attendance.totalOtHour;
            totalExtraDaysPay = totalExtraDaysPay + otherDaysPayRate;
            totalExtraDaysOtPay = totalExtraDaysOtPay + attendance.totalOtHour * otPayRate;
          } else {
            totalRegularDays++;
            if (attendance.totalOtHour > 1.3) {
              totalToolbox = totalToolbox + 1;
              totalTravel = totalTravel + 0.3;
              const lunchHours = attendance.lunchHours === undefined ? 0 : attendance.lunchHours;
              totalLunchHours = totalLunchHours + lunchHours;
              const otHours = attendance.totalOtHour - 1 - 0.3 - lunchHours;
              totalOtHours = totalOtHours + otHours;
              totalOtPay = totalOtPay + otHours * otPayRate;
              totalRegularPay = totalRegularPay + otHours * otPayRate;
            } else {
              totalToolbox = totalToolbox + attendance.totalOtHour;
              totalOtHours = totalOtHours + attendance.totalOtHour;
              totalOtPay = totalOtPay + attendance.totalOtHour * otPayRate;
              totalRegularPay = totalRegularPay + attendance.totalOtHour * otPayRate;
            }
          }
        });
      }

      additonalPay = totalExtraDaysPay + totalPhDaysPay + totalOtPay + totalExtraDaysOtPay + totalPhDaysOtPay;

      //total pay
      const totalPay = basicSalary + additonalPay;

      console.log(employee.getDataValue('id'));
      console.log(totalPay);

      if (payData === null) {
        await PayService.createPay(
          selectedMonth,
          employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
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
          totalOtHours,
          totalRegularPay,
          totalExtraDaysPay,
          totalPhDaysPay,
          totalOtPay,
          totalExtraDaysOtPay,
          totalPhDaysOtPay,
          totalPay,
          employee.getDataValue('id')
        );
      } else {
        await PayService.editPay(
          selectedMonth,
          employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
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
          totalOtHours,
          totalRegularPay,
          totalExtraDaysPay,
          totalPhDaysPay,
          totalOtPay,
          totalExtraDaysOtPay,
          totalPhDaysOtPay,
          totalPay,
          employee.getDataValue('id')
        );
      }
    });
    Promise.all(promises).then(async () => {
      const { employeePay, employeeAttendance } = await PayService.getEmployeePayBySelectedMonth(selectedMonth);
      return res.status(OK).json({ employeePay, employeeAttendance });
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const exportPayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { selectedMonth } = req.body;
    const { employeePay, employeeAttendance } = await PayService.getEmployeePayBySelectedMonth(selectedMonth);
    return res.status(OK).json({ employeePay, employeeAttendance });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

PayController.get('/', Authentication.AUTHENTICATED, searchPayHandler);
PayController.post('/', Authentication.AUTHENTICATED, calculatePayHandler);
PayController.post('/export', Authentication.AUTHENTICATED, exportPayHandler);

export default PayController;
