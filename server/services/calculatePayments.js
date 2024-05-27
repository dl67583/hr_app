const { Op } = require('sequelize');
const { User, TimeAttendance, Payment } = require('../models');

const calculatePayments = async () => {
  const users = await User.findAll();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  for (const user of users) {
    const timeAttendances = await TimeAttendance.findAll({
      where: {
        userId: user.id,
        timeOfEntering: {
          [Op.gte]: new Date(currentYear, currentMonth - 1, 1),
          [Op.lt]: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    let regularHours = 0;
    let overtimeHours = 0;
    let weekendHours = 0;
    let nightHours = 0;

    for (const attendance of timeAttendances) {
      const enteringTime = new Date(attendance.timeOfEntering);
      const leavingTime = new Date(attendance.timeOfLeaving);
      const hoursWorked = (leavingTime - enteringTime) / (1000 * 60 * 60);

      // Check if the hours fall on a weekend
      if (enteringTime.getDay() === 6 || enteringTime.getDay() === 0) {
        weekendHours += hoursWorked;
      } else {
        // Check if the hours fall in the night shift (e.g., 10 PM to 6 AM)
        if (
          (enteringTime.getHours() >= 22 && leavingTime.getHours() < 6) ||
          (enteringTime.getHours() < 6 && leavingTime.getHours() >= 6)
        ) {
          nightHours += hoursWorked;
        } else if (hoursWorked > 8) {
          regularHours += 8;
          overtimeHours += hoursWorked - 8;
        } else {
          regularHours += hoursWorked;
        }
      }
    }

    const totalPayment =
      regularHours * user.hourlyPay +
      overtimeHours * user.hourlyPay * 1.2 +
      weekendHours * user.hourlyPay * 1.5 +
      nightHours * user.hourlyPay * 1.5;

    await Payment.create({
      userId: user.id,
      month: currentMonth,
      year: currentYear,
      hoursWorked: regularHours + overtimeHours + weekendHours + nightHours,
      regularHours,
      overtimeHours,
      weekendHours,
      nightHours,
      totalPayment,
    });
  }
};

module.exports = calculatePayments;
