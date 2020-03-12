import { getHolidayModel } from '../models';
import Holiday from '../models/Holiday';
import { Op } from 'sequelize';

export const getPaginated = async (offset?: number, limit?: number, q: string = '') => {
  const model = getHolidayModel();

  // eslint-disable-next-line
  const where: any = {
    [Op.and]: {}
  };

  if (q) {
    where[Op.and] = {
      [Op.or]: {
        descriptions: {
          [Op.iLike]: `%${q}%`
        }
      }
    };
  }

  return model.findAndCountAll<Holiday>({
    where,
    limit,
    offset
  });
};

export const getAll = () => {
  const model = getHolidayModel();

  return model.findAndCountAll<Holiday>();
};

export const getById = (id: number) => {
  const model = getHolidayModel();

  return model.findByPk<Holiday>(id);
};

export const createHoliday = async (holidayDate: Date, descriptions: string) => {
  const model = getHolidayModel();

  return model.create<Holiday>({
    holidayDate,
    descriptions
  });
};

export const deleteHoliday = async (id: number) => {
  const model = getHolidayModel();

  return model.destroy({ where: { id } });
};
