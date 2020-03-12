import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import { Authentication } from '../config/passport';

import Logger from '../Logger';
import * as EmployeeService from '../services/EmployeeService';

const EmployeeController = express.Router();
const LOG = new Logger('EmployeeController.ts');

interface GlobalSearchEmployeeQueryParams {
  q?: string;
}

const globalSearchEmployeeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { q }: GlobalSearchEmployeeQueryParams = req.query;

    const { rows, count } = await EmployeeService.globalSearchEmployees(q);

    return res.status(OK).json({
      count,
      employees: rows.map(row => row.toResponseFormat())
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

interface SearchEmployeeQueryParams {
  s: number; // is offset for pagination search
  l?: number; // limit for pagination search
  q?: string; // query for searching
}

const SearchEmployeeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q }: SearchEmployeeQueryParams = req.query;

    const { rows, count } = await EmployeeService.searchEmployeesWithPagination(s, l, q);

    return res.status(OK).json({
      count,
      employees: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const getEmployeeByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeService.getEmployeeById(id);

    return res.status(OK).json({
      employee
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createEmployeeHandler: RequestHandler = async (req, res, next) => {
  try {
    const { employeesToImport } = req.body;
    const { rows, count } = await EmployeeService.createEmployees(employeesToImport);

    return res.status(OK).json({ newEmployee: rows, count });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

EmployeeController.get('/', Authentication.AUTHENTICATED, SearchEmployeeHandler);
EmployeeController.post('/', Authentication.AUTHENTICATED, createEmployeeHandler);
EmployeeController.get('/globalsearch', Authentication.AUTHENTICATED, globalSearchEmployeeHandler);
EmployeeController.get('/:id', Authentication.AUTHENTICATED, getEmployeeByIdHandler);

export default EmployeeController;
