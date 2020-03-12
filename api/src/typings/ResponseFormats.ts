export interface EmployeeResponseModel {
  id: string;
  name: string;
  type: string;
  basicSalary: number;
  hourPayRate: number;
  otPayRate: number;
  workHourPerDay: number;
  offDayPerMonth: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeDetailsResponseModel extends EmployeeResponseModel {
  totalRegularHours: number;
  totalExtraDays: number;
  totalOtHours: number;
  totalHours: number;
  totalRegularPay: number;
  totalExtraDaysPay: number;
  totalOtPay: number;
  totalPay: number;
}

export interface UserResponseModel {
  id: number;
  loginName: string;
  displayName: string;
  email: string;
}

export interface AttendanceResponseModel {
  shiftDate: Date;
  attendanceType: string;
  shiftStartTime: Date;
  shiftEndTime: Date;
  totalHour: number;
  location?: string;
  EmployeeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PayResponseModel {
  monthYear: string;
  hourPayRate: number;
  otPayRate: number;
  totalRegularHours: number;
  totalExtraDays: number;
  totalOtHours: number;
  totalHours: number;
  totalRegularPay: number;
  totalExtraDaysPay: number;
  totalOtPay: number;
  totalPay: number;
}

export interface EmployeeDetailsPayResponseModel extends EmployeeResponseModel {
  monthYear: string;
  totalRegularHours: number;
  totalExtraDays: number;
  totalOtHours: number;
  totalHours: number;
  totalRegularPay: number;
  totalExtraDaysPay: number;
  totalOtPay: number;
  totalPay: number;
}

export interface EmployeeAttendanceToExportResponseModel {
  shiftDate: string;
  EmployeeId: string;
  location: string;
  totalHour: string;
}
