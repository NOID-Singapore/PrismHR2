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

    const { holidays } = await HolidayService.getAllHoliday();
    console.log(holidays);

    const promises = employees.map(async employee => {
      const payData = await PayService.getPayByEmployeeIdAndPeriod(employee.getDataValue('id'), selectedMonth);

      //a
      const basicSalary = employee.getDataValue('basicSalary');

      //g
      const { Attendances } = await AttendanceService.getAttendaceByIdAndShiftDate(employee.getDataValue('id'), selectedMonth);
      let totalWorkHourInMonth = 0;
      Attendances.map(attendance => {
        totalWorkHourInMonth = totalWorkHourInMonth + attendance.getDataValue('totalHour');
      });

      const numberDaysInMonth = new Date(new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth() + 1, 0).getDate();
      //z
      const numberOffDaysInMonth = employee.getDataValue('offDayPerMonth');

      //d
      const totalWorkDaysInMonth = numberDaysInMonth - numberOffDaysInMonth;

      //y
      const regularWorkingHoursInDay = employee.getDataValue('workHourPerDay');

      //e
      const totalRegularWorkHourInMonth = totalWorkDaysInMonth * regularWorkingHoursInDay;

      //i
      const overtimePayRate = employee.getDataValue('otPayRate');

      //c
      const totalOvertimePay = (totalWorkHourInMonth - totalRegularWorkHourInMonth) * overtimePayRate;

      //f (belum pasti)
      const { workDays } = await AttendanceService.getTotalWorkDaysInMonth(employee.getDataValue('id'), selectedMonth);

      //b
      let overtimeDaysPay = 0;
      if (workDays !== 0) {
        overtimeDaysPay = (basicSalary / totalWorkDaysInMonth) * (Number(workDays) - totalWorkDaysInMonth);
      }

      //j
      const overtimeHoursPay =
        (totalWorkHourInMonth - ((Number(workDays) - totalWorkDaysInMonth) * regularWorkingHoursInDay + totalRegularWorkHourInMonth)) *
        overtimePayRate;

      //h
      const hourPayRate = employee.getDataValue('hourPayRate');

      if (payData === null) {
        //Calculate Type 1
        if (employee.getDataValue('type').toUpperCase() === 'WP-PRC' || employee.getDataValue('type').toUpperCase() === 'S-PASS') {
          const totalPay = basicSalary + totalOvertimePay;

          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.createPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            null,
            totalOvertimePay,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 2
        else if (
          employee.getDataValue('type').toUpperCase() === 'LTVP' ||
          employee.getDataValue('type').toUpperCase() === 'WP-MALAYSIAN' ||
          employee.getDataValue('type').toUpperCase() === 'SINGAPOREAN'
        ) {
          const totalPay = (basicSalary + overtimeDaysPay + overtimeHoursPay).toFixed(2);
          const totalOtPay = overtimeHoursPay <= 0 ? null : (overtimeDaysPay + overtimeHoursPay).toFixed(2);
          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.createPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            Number(workDays) - totalWorkDaysInMonth,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            overtimeDaysPay.toFixed(2),
            totalOtPay,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 3
        else if (employee.getDataValue('type').toUpperCase() === 'HOURLY') {
          const totalPay = totalRegularWorkHourInMonth * hourPayRate + totalOvertimePay;
          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.createPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            null,
            null,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 4
        else if (employee.getDataValue('type').toUpperCase() === 'DAILY') {
          const totalPay = totalRegularWorkHourInMonth * hourPayRate;
          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.createPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            null,
            totalWorkHourInMonth,
            basicSalary,
            null,
            null,
            totalPay,
            employee.getDataValue('id')
          );
        }
      } else {
        //Calculate Type 1
        if (employee.getDataValue('type').toUpperCase() === 'WP-PRC' || employee.getDataValue('type').toUpperCase() === 'S-PASS') {
          const totalPay = basicSalary + totalOvertimePay;

          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.editPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            null,
            totalOvertimePay,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 2
        else if (
          employee.getDataValue('type').toUpperCase() === 'LTVP' ||
          employee.getDataValue('type').toUpperCase() === 'WP-MAlAYSIAN' ||
          employee.getDataValue('type').toUpperCase() === 'SINGAPOREAN'
        ) {
          const totalPay = (basicSalary + overtimeDaysPay + overtimeHoursPay).toFixed(2);
          const totalOtPay = overtimeHoursPay <= 0 ? null : (overtimeDaysPay + overtimeHoursPay).toFixed(2);

          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.editPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            Number(workDays) - totalWorkDaysInMonth,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            overtimeDaysPay.toFixed(2),
            totalOtPay,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 3
        else if (employee.getDataValue('type').toUpperCase() === 'HOURLY') {
          const totalPay = totalRegularWorkHourInMonth * hourPayRate + totalOvertimePay;
          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.editPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            totalWorkHourInMonth - totalRegularWorkHourInMonth,
            totalWorkHourInMonth,
            basicSalary,
            null,
            totalOvertimePay,
            totalPay,
            employee.getDataValue('id')
          );
        }
        //Calculate Type 4
        else if (employee.getDataValue('type').toUpperCase() === 'DAILY') {
          const totalPay = totalRegularWorkHourInMonth * hourPayRate;
          console.log(employee.getDataValue('type'));
          console.log(employee.getDataValue('id'));
          console.log(totalPay);

          await PayService.editPay(
            selectedMonth,
            employee.getDataValue('hourPayRate') === null ? 0 : employee.getDataValue('hourPayRate'),
            overtimePayRate,
            totalRegularWorkHourInMonth,
            null,
            null,
            totalWorkHourInMonth,
            basicSalary,
            null,
            null,
            totalPay,
            employee.getDataValue('id')
          );
        }
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
