interface EmployeeAttendancesModel {
  name: string;
  shiftDate: Date | string;
  attendanceType: string;
  shiftStartTime: Date | string;
  shiftEndTime: Date | string;
  lunchHours?: string;
  totalOtHour: number;
  location?: string;
  EmployeeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
