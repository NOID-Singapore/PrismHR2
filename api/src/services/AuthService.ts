import jwt from 'jsonwebtoken';

import Logger from '../Logger';
import User from '../database/models/User';
import * as UserDao from '../database/dao/UserDao';
import { verifyUserPassword } from './PasswordService';
import InvalidUserError from '../errors/InvalidUserError';
import InvalidPasswordError from '../errors/InvalidPasswordError';
import RedisClient, { getRedisKey } from '../config/RedisClient';
import UserLockedError from '../errors/UserLockedError';

const LOG = new Logger('AuthService.ts');

export const verifyUserCredentials = async (loginName: string, inputPassword: string): Promise<User> => {
  const user = await UserDao.getByLoginName(loginName);

  if (!user || !user.get('active')) {
    LOG.warn(`Invalid user: ${loginName} does not exist`);
    throw new InvalidUserError();
  }

  if (user.get('lock')) {
    LOG.warn(`User: ${loginName} account is locked`);
    throw new UserLockedError(loginName);
  }

  if (!(await verifyUserPassword(user, inputPassword))) {
    LOG.warn(`User: ${loginName} tried logging in with invalid password`);
    throw new InvalidPasswordError(user);
  }

  return user;
};

export const generateUserJwt = (user: User, jwtid: string): string => {
  const body = {
    id: user.get('id')
  };

  return jwt.sign(body, process.env.APP_SECRET, { jwtid });
};

export const createSession = async (user: User, sessionId: string): Promise<void> => {
  const userId = user.get('id');

  const authenticationSetKey = getRedisKey(userId);

  await RedisClient.sadd(authenticationSetKey, sessionId);
};

export const resetInvalidLoginCounts = async (user: User): Promise<void> => {
  await user.update({ invalidLogin: 0 });
};

export const checkIfValidSession = async (userId: number, sessionId: string): Promise<boolean> => {
  const isValidSession = await RedisClient.sismember(getRedisKey(userId), sessionId);

  // casting to boolean
  return isValidSession > 0;
};

export const destroySession = async (userId: number, sessionId: string): Promise<void> => {
  const authenticationSetKey = getRedisKey(userId);

  await RedisClient.srem(authenticationSetKey, sessionId);
};
