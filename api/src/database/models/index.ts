import { models as Models } from '../../config/database';

export const getUserModel = () => {
  return Models.User;
};

export const getEmployeeModel = () => {
  return Models.Employee;
};

export const getAttendanceModel = () => {
  return Models.Attendance;
};

export const getPayModel = () => {
  return Models.Pay;
};

export const getHolidayModel = () => {
  return Models.Holiday;
};
