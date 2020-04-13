interface EmployeeDetailsModel {
  id: string;
  name: string;
  position: string;
  basicSalary: number;
  hourPayRate?: number;
  otherDaysPayRate?: number;
  otPayRate?: number;
  lunchHours?: number;
  workHourPerDay: number;
  totalRegularHours?: number;
  totalExtraDays?: number;
  totalOtHours?: number;
  totalHours?: number;
  totalRegularPay?: number;
  totalExtraDaysPay?: number;
  totalOtPay?: number;
  totalPay?: number;
  createdAt?: Date;
  updatedAt?: Date;
  new?: boolean;
}
