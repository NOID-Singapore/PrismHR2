import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class UserNotFoundError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Holiday: ${identifier} is not found`, ErrorCodes.HOLIDAY_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default UserNotFoundError;
