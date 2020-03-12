import User from '../models/User';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Pay from '../models/Pay';
import Holiday from '../models/Holiday';
import ModelBase from '../models/ModelBase';

export interface Models {
  User: typeof User;
  Employee: typeof Employee;
  Attendance: typeof Attendance;
  Pay: typeof Pay;
  Holiday: typeof Holiday;
  [key: string]: typeof ModelBase;
}
