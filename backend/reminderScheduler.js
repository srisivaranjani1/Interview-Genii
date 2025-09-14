const cron = require('node-cron');
const Meeting = require('./models/Meeting');
const nodemailer = require('nodemailer');
// const twilio = require('twilio');
require('dotenv').config(); // This must be called before using process.env


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

module.exports = function () {
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    const meetings = await Meeting.find();

    meetings.forEach(meeting => {
      const remindAt = new Date(meeting.startDateTime.getTime() - meeting.reminderMinutes * 60000);
      const diff = Math.abs(now.getTime() - remindAt.getTime());

      if (diff < 60000) {
        // if (meeting.notificationType === 'SMS') {
        //   twilioClient.messages.create({
        //     body: `Reminder: Meeting "${meeting.title}" at ${new Date(meeting.startDateTime).toLocaleString()}`,
        //     from: process.env.TWILIO_PHONE_NUMBER, // ✅ match your .env and sendSMS.js
        //     to: meeting.phone,
        //   });
        //} 
        if (meeting.notificationType === 'Email') {
          transporter.sendMail({
            user: process.env.EMAIL_USER,
            to: meeting.email,
            subject: 'Meeting Reminder',
            text: `Reminder: Meeting "${meeting.title}" at ${new Date(meeting.startDateTime).toLocaleString()}`,
          });
        }
      }
    });
  });
};

