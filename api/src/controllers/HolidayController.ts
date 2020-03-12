import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import * as HolidayService from '../services/HolidayService';

const HolidayController = express.Router();
const LOG = new Logger('HolidayController.ts');

interface SearchHolidayQueryParams {
  s: number;
  l?: number;
  q?: string;
}

const searchHolidayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q }: SearchHolidayQueryParams = req.query;

    const { rows, count } = await HolidayService.searchHolidaysWithPagination(s, l, q);

    return res.status(OK).json({
      count,
      holidays: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createHolidayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { holidayDate, descriptions } = req.body;

    const newHoliday = await HolidayService.createHoliday(holidayDate, descriptions);

    return res.status(OK).json(newHoliday);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editHolidayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { holidayDate, descriptions } = req.body;

    const editHoliday = await HolidayService.editHoliday(id, holidayDate, descriptions);

    return res.status(OK).json(editHoliday);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deleteHolidayHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await HolidayService.deleteHoliday(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

HolidayController.get('/', Authentication.AUTHENTICATED, searchHolidayHandler);
HolidayController.post('/', Authentication.AUTHENTICATED, createHolidayHandler);
HolidayController.put('/:id', Authentication.AUTHENTICATED, editHolidayHandler);
HolidayController.delete('/:id', Authentication.AUTHENTICATED, deleteHolidayHandler);

export default HolidayController;
