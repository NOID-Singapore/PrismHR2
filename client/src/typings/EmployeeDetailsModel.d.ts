interface EmployeeDetailsModel {
  id: string;
  name: string;
  position?: string;
  basicSalary?: number;
  hourPayRate?: number;
  otherDaysPayRate?: number;
  otPayRate?: number;
  lunchHours?: string;
  workHourPerDay?: number;
  totalRegularDays?: number;
  totalExtraDays?: number;
  totalPhDays?: number;
  totalOtHours?: number;
  totalExtraDaysOt?: number;
  totalPhDaysOt?: number;
  totalHours?: number;
  totalRegularPay?: number;
  totalExtraDaysPay?: number;
  totalPhDaysPay?: number;
  totalOtPay?: number;
  totalExtraDaysOtPay?: number;
  totalPhDaysOtPay?: number;
  totalPay?: number;
  createdAt?: Date;
  updatedAt?: Date;
  new?: boolean;
}
