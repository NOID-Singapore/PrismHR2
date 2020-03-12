import express, { RequestHandler } from 'express';
import { OK } from 'http-status-codes';
import uuidv4 from 'uuid/v4';

import Logger from '../Logger';
import { Authentication } from '../config/passport';
import User from '../database/models/User';
import * as AuthService from '../services/AuthService';

const AuthController = express.Router();
const LOG = new Logger('AuthController.ts');

const authenticationSuccessHandler: RequestHandler = async (req, res, next) => {
  try {
    const user: User = req.user;
    const id = user.get('id');
    const displayName = user.get('displayName');
    const loginName = user.get('loginName');
    const sessionId: string = uuidv4();

    await AuthService.createSession(user, sessionId);

    return res.status(OK).json({
      token: AuthService.generateUserJwt(user, sessionId),
      currentUser: {
        id,
        displayName,
        loginName
      }
    });
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id, jti } = req.user;

    await AuthService.destroySession(id, jti);

    return res.sendStatus(OK);
  } catch (err) {
    LOG.error(err);
    return next(err);
  }
};

AuthController.post('/login', Authentication.TO_AUTHENTICATE, authenticationSuccessHandler);
AuthController.post('/logout', Authentication.AUTHENTICATED, logoutHandler);

export default AuthController;
