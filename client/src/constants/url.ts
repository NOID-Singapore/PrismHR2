const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const LOGIN_URL = `${BASE_URL}/login`;
export const LOGOUT_URL = `${BASE_URL}/logout`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}/forgotpassword`;
export const RESET_PASSWORD_URL = `${BASE_URL}/resetpassword`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/changepassword`;

export const USER_BASE_URL = `${BASE_URL}/users`;
export const GET_CURRENT_USER_URL = `${USER_BASE_URL}/current`;
export const GET_EDIT_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}`;
export const GET_DEACTIVATE_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}`;
export const GET_ACTIVATE_USER_URL = (userId: number) => `${USER_BASE_URL}/${userId}/activate`;

export const EMPLOYEE_BASE_URL = `${BASE_URL}/employees`;
export const EMPLOYEE_GLOBAL_SEARCH_URL = `${EMPLOYEE_BASE_URL}/globalsearch`;
export const GET_EMPLOYEE_BY_ID_URL = (employeeId?: string) => `${EMPLOYEE_BASE_URL}/${employeeId}`;

export const ATTENDANCE_BASE_URL = `${BASE_URL}/attendances`;
export const GET_EDIT_ATTENDANCE_LUNCH_HOURS_URL = (employeeId: string) => `${ATTENDANCE_BASE_URL}/${employeeId}`;

export const PAY_BASE_URL = `${BASE_URL}/pays`;

export const HOLIDAY_BASE_URL = `${BASE_URL}/holidays`;
export const GET_EDIT_HOLIDAY_URL = (holidayId: number) => `${HOLIDAY_BASE_URL}/${holidayId}`;
export const GET_DELETE_HOLIDAY_URL = (holidayId: number) => `${HOLIDAY_BASE_URL}/${holidayId}`;

export const GET_PAY_TO_EXPORT_URL = `${PAY_BASE_URL}/export`;
