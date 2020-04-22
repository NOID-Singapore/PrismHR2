import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import { Authentication } from '../config/passport';

import Logger from '../Logger';
import * as AttendanceService from '../services/AttendanceService';

const AttendanceController = express.Router();
const LOG = new Logger('AttendanceController.ts');

interface SearchAttendanceQueryParams {
  eid: string; // employee id for pagination search
  s: number; // offset for pagination search
  l?: number; // limit for pagination search
  q?: string; // query for searching
  fb?: string; // filter by for term (shift start time, shift end time)
  sd?: string; // start date value
  ed?: string; // end date value
}

const searchAttendanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { eid, s, l, q, fb, sd, ed }: SearchAttendanceQueryParams = req.query;

    const { rows, count } = await AttendanceService.searchAttendancesWithPagination(eid, s, l, q, fb, sd, ed);

    return res.status(OK).json({
      count,
      attendanceHistories: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createAttendanceHandler: RequestHandler = async (req, res, next) => {
  try {
    const { attendancesToImport } = req.body;

    const newAttendances = await AttendanceService.createAttendances(attendancesToImport);

    return res.status(OK).json({ newAttendances });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editAttendanceLunchHourHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shiftDate, lunchHours } = req.body;

    const editAttendanceLunchHour = await AttendanceService.updateAttendanceLunchHour(shiftDate, lunchHours, id);

    return res.status(OK).json(editAttendanceLunchHour);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

AttendanceController.get('/', Authentication.AUTHENTICATED, searchAttendanceHandler);
AttendanceController.post('/', Authentication.AUTHENTICATED, createAttendanceHandler);
AttendanceController.put('/:id', Authentication.AUTHENTICATED, editAttendanceLunchHourHandler);

export default AttendanceController;
