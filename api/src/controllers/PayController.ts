import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import { Authentication } from '../config/passport';
import { format } from 'date-fns';

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
      // if (format(new Date(selectedMonth), 'yyyy-MM') === format(new Date(holiday.getDataValue('holidayDate')), 'yyyy-MM')) {
      //   holidayArray.push(holiday.getDataValue('holidayDate'));
      // }
    });

    const promises = employees.map(async employee => {
      const payData = await PayService.getPayByEmployeeIdAndPeriod(employee.getDataValue('id'), selectedMonth);

      //a basic salary
      const basicSalary = employee.getDataValue('basicSalary');

      //b sunday/ph pay rate
      const otherDaysPayRate = employee.getDataValue('otherDaysPayRate');

      //c ot rate
      const otPayRate = employee.getDataValue('otPayRate');

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

      //g regular work hours
      // const regularWorkHours = employee.getDataValue('regularWorkHour');
      // console.log(regularWorkHours);

      //Unique Shift Date Attendance
      const { AttendanceShiftDate } = await AttendanceService.getAttendaceByIdAndShiftDateUnique(employee.getDataValue('id'), selectedMonth);

      if (holidayArray.length > 0) {
        AttendanceShiftDate.map(attendance => {
          const convertToDate = new Date(attendance.shiftDate);
          const getDay = convertToDate.getDay();
          let phDate;
          holidayArray.map((holiday: any) => {
            if (attendance.shiftDate === holiday) {
              phDate = holiday;
            }
          });

          const startTime = new Date(attendance.shiftDate + ' ' + attendance.shiftStartTime);
          const endTime = new Date(attendance.shiftDate + ' ' + attendance.shiftEndTime);
          const workTime = endTime.getHours() - startTime.getHours();
          console.log('work time', workTime);

          if (getDay === 0) {
            if (workTime > 0) {
              totalExtraDays++;
              totalExtraDaysOt = totalExtraDaysOt + attendance.totalOtHour;
              totalExtraDaysPay = totalExtraDaysPay + otherDaysPayRate;
              totalExtraDaysOtPay = totalExtraDaysOtPay + attendance.totalOtHour * otPayRate;
            }
          } else if (attendance.shiftDate === phDate) {
            if (workTime > 0) {
              console.log('ph date 2', phDate);
              totalPhDays++;
              totalPhDaysOt = totalPhDaysOt + attendance.totalOtHour;
              totalPhDaysPay = totalPhDaysPay + otherDaysPayRate;
              totalPhDaysOtPay = totalPhDaysOtPay + attendance.totalOtHour * otPayRate;
            }
          } else {
            totalRegularDays++;
            if (attendance.totalOtHour >= 2) {
              totalToolbox = totalToolbox + 1;
              totalTravel = totalTravel + 0.5;
              const otHours = attendance.totalOtHour - 1 - 0.5;
              totalOtHours = totalOtHours + otHours;
              totalOtPay = totalOtPay + otHours * otPayRate;
              totalRegularPay = totalRegularPay + otHours * otPayRate;
            } else {
              // totalToolbox = totalToolbox + attendance.totalOtHour;
              const otHours = attendance.totalOtHour;
              totalOtHours = totalOtHours + otHours;
              totalOtPay = totalOtPay + otHours * otPayRate;
              totalRegularPay = totalRegularPay + attendance.totalOtHour * otPayRate;
            }
          }

          const lunchHours = attendance.lunchHours === undefined ? 0 : attendance.lunchHours;
          totalLunchHours = totalLunchHours + lunchHours;
        });
      } else {
        AttendanceShiftDate.map(attendance => {
          const convertToDate = new Date(attendance.shiftDate);
          const getDay = convertToDate.getDay();

          const startTime = new Date(attendance.shiftDate + ' ' + attendance.shiftStartTime);
          const endTime = new Date(attendance.shiftDate + ' ' + attendance.shiftEndTime);
          const workTime = endTime.getHours() - startTime.getHours();

          if (getDay === 0) {
            if (workTime > 0) {
              totalExtraDays++;
              totalExtraDaysOt = totalExtraDaysOt + attendance.totalOtHour;
              totalExtraDaysPay = totalExtraDaysPay + otherDaysPayRate;
              totalExtraDaysOtPay = totalExtraDaysOtPay + attendance.totalOtHour * otPayRate;
            }
          } else {
            totalRegularDays++;
            if (attendance.totalOtHour >= 2) {
              totalToolbox = totalToolbox + 1;
              totalTravel = totalTravel + 0.5;
              const otHours = attendance.totalOtHour - 1 - 0.5;
              totalOtHours = totalOtHours + otHours;
              totalOtPay = totalOtPay + otHours * otPayRate;
              totalRegularPay = totalRegularPay + otHours * otPayRate;
            } else {
              // totalToolbox = totalToolbox + attendance.totalOtHour;
              const otHours = attendance.totalOtHour;
              totalOtHours = totalOtHours + otHours;
              totalOtPay = totalOtPay + otHours * otPayRate;
              totalRegularPay = totalRegularPay + attendance.totalOtHour * otPayRate;
            }
          }

          const lunchHours = attendance.lunchHours === undefined ? 0 : attendance.lunchHours;
          totalLunchHours = totalLunchHours + lunchHours;
        });
      }

      const toolboxPay = totalToolbox * otPayRate;
      const travelPay = totalTravel * otPayRate;
      const lunchPay = totalLunchHours * otPayRate;
      additonalPay = totalExtraDaysPay + totalPhDaysPay + toolboxPay + travelPay + lunchPay + totalOtPay + totalExtraDaysOtPay + totalPhDaysOtPay;

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
          employee.getDataValue('basicSalary') === null ? 0 : employee.getDataValue('basicSalary'),
          totalExtraDaysPay,
          totalPhDaysPay,
          toolboxPay,
          travelPay,
          lunchPay,
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
          employee.getDataValue('basicSalary') === null ? 0 : employee.getDataValue('basicSalary'),
          totalExtraDaysPay,
          totalPhDaysPay,
          toolboxPay,
          travelPay,
          lunchPay,
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
