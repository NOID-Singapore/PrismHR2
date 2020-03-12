import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class EmployeeNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Employee: ${identifier} is not found`, ErrorCodes.EMPLOYEE_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default EmployeeNotFoundError;
