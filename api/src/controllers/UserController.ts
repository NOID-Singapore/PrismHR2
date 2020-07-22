import express, { RequestHandler } from 'express';
import { OK, NO_CONTENT } from 'http-status-codes';
import { ValidationChain, body } from 'express-validator';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import ValidationHandler from './ValidationHandler';
import * as UserService from '../services/UserService';
import * as UserDao from '../database/dao/UserDao';

const UserController = express.Router();
const LOG = new Logger('UserController.ts');

interface SearchUserQueryParams {
  s: number;
  l?: number;
  q?: string;
}

const searchUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const { s, l, q }: SearchUserQueryParams = req.query;

    const { rows, count } = await UserService.searchUsersWithPagination(s, l, q);

    return res.status(OK).json({
      count,
      users: rows
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const getCurrentUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.user;

    const currentUser = await UserDao.getById(id);

    return res.status(OK).json({
      id: currentUser.get('id'),
      displayName: currentUser.get('displayName'),
      loginName: currentUser.get('loginName')
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const editUserValidator: ValidationChain[] = [
  body('email', 'Invalid email format')
    .optional()
    .isEmail()
];

const editUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayName, email, newPassword } = req.body;

    const editedUser = await UserService.editUser(id, displayName, email, newPassword);

    return res.status(OK).json(editedUser);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const activateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserService.activateUser(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const deactivateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    await UserService.deactivateUser(id);

    return res.sendStatus(NO_CONTENT);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const createUserValidator: ValidationChain[] = [
  body('displayName', 'Display Name must not be empty')
    .not()
    .isEmpty(),
  body('email', 'Email must not be empty and is correct format')
    .not()
    .isEmpty()
    .isEmail()
];

const createUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { displayName, email } = req.body;

    const newUser = await UserService.createUser(displayName, email);

    return res.status(OK).json(newUser);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

UserController.get('/current', Authentication.AUTHENTICATED, getCurrentUserHandler);
UserController.put('/:id', Authentication.AUTHENTICATED, editUserValidator, ValidationHandler, editUserHandler);
UserController.get('/', Authentication.AUTHENTICATED, searchUsersHandler);
UserController.post('/:id/activate', Authentication.AUTHENTICATED, activateUserHandler);
UserController.delete('/:id', Authentication.AUTHENTICATED, deactivateUserHandler);
UserController.post('/', Authentication.AUTHENTICATED, createUserValidator, ValidationHandler, createUserHandler);

export default UserController;
