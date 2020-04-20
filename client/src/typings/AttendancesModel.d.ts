interface AttendancesModel {
  shiftDate: Date | string;
  attendanceType: string;
  shiftStartTime: Date | string;
  shiftEndTime: Date | string;
  totalOtHour: number;
  location?: string;
  EmployeeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
