interface EmployeeDetailsModel {
  id: string;
  name: string;
  type: string;
  basicSalary: number;
  hourPayRate?: number;
  otPayRate?: number;
  workHourPerDay: number;
  offDayPerMonth: number;
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
