interface AttendancesModel {
  shiftDate: Date | string;
  attendanceType: string;
  shiftStartTime: Date | string;
  shiftEndTime: Date | string;
  lunchHours?: number;
  totalOtHour: number;
  location?: string;
  EmployeeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
