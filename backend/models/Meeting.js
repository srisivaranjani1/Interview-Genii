const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  location: String,
  calendarType: String,
  phone: String,
  email: String,
  notificationType: String,
  reminderMinutes: Number,
  startDateTime: Date, // used for reminder
});

module.exports = mongoose.model('Meeting', meetingSchema);

