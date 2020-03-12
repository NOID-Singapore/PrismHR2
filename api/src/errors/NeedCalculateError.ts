import { BAD_REQUEST } from 'http-status-codes';

import ErrorBase from './ErrorBase';
import ErrorCodes from '../constants/ErrorCodes';

class NeedCalculateError extends ErrorBase {
  public constructor() {
    super('Need Calculate First', ErrorCodes.NEED_CALCULATE_ERROR_CODE, BAD_REQUEST);
  }
}

export default NeedCalculateError;
