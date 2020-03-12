import express from 'express';

import AuthController from './controllers/AuthController';
import PasswordController from './controllers/PasswordController';
import UserController from './controllers/UserController';
import EmployeeController from './controllers/EmployeeController';
import AttendanceController from './controllers/AttendanceController';
import PayController from './controllers/PayController';
import HolidayController from './controllers/HolidayController';
import HealthCheckController from './controllers/HealthCheckController';

const router = express.Router();

router.use('/', AuthController);
router.use('/', PasswordController);
router.use('/healthcheck', HealthCheckController);
router.use('/users', UserController);
router.use('/employees', EmployeeController);
router.use('/attendances', AttendanceController);
router.use('/pays', PayController);
router.use('/holidays', HolidayController);

export default router;
