import { getUserModel } from '../models';
import User from '../models/User';
import { FindOptions, Op } from 'sequelize';
import { hashPassword } from '../../services/PasswordService';

export const getById = (id: number, findOption?: FindOptions) => {
  const model = getUserModel();

  return model.findByPk<User>(id, findOption);
};

export const getByLoginName = (loginName: string) => {
  const model = getUserModel();

  return model.findOne<User>({ where: { loginName } });
};

export const countById = (id: number) => {
  const model = getUserModel();

  return model.count({ where: { id } });
};

export const countByLoginName = (loginName: string) => {
  const model = getUserModel();

  return model.count({ where: { loginName } });
};

export const countByTenantAndStatus = (tenantKey: string, active: boolean) => {
  const model = getUserModel();

  return model.count({ where: { TenantKey: tenantKey, active } });
};

export const deactivateUserById = (id: number) => {
  const model = getUserModel();

  return model.update<User>({ active: false }, { where: { id } });
};

export const getPaginated = async (offset?: number, limit?: number, q: string = '') => {
  const model = getUserModel();

  // eslint-disable-next-line
  const where: any = {
    [Op.and]: {}
  };

  if (q) {
    where[Op.and] = {
      [Op.or]: {
        loginName: {
          [Op.iLike]: `%${q}%`
        },
        displayName: {
          [Op.iLike]: `%${q}%`
        }
      }
    };
  }

  return model.findAndCountAll<User>({
    where,
    limit,
    offset
  });
};

export const createUser = async (email: string, displayName: string, clearPassword: string) => {
  const model = getUserModel();

  return model.create<User>({
    loginName: email,
    password: await hashPassword(clearPassword),
    displayName,
    email,
    active: 't'
  });
};
