const cron = require('node-cron');
const calculatePayments = require('../services/calculatePayments');

const schedulePayments = () => {
  cron.schedule('0 0 1 * *', () => {
    console.log('Running payment calculation at the end of the month');
    calculatePayments();
  });
};

module.exports = schedulePayments;
