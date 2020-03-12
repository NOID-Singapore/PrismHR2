import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class AttendanceNotFountError extends ErrorBase {
  public constructor(identifier: string | number) {
    super(`Attendance: ${identifier} is not found`, ErrorCodes.ATTENDANCE_NOT_FOUND_ERROR_CODE, BAD_REQUEST);
  }
}

export default AttendanceNotFountError;
