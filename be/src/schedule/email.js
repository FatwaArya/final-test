const schedule = require("node-schedule");
const HR = require("../model/user");
const Overtime = require("../model/overtime");
const Reimbursment = require("../model/reimbursment");
const { transporter } = require("../routes/user");

const emailNotif = schedule.scheduleJob("0 0 * * *", async () => {
  try {
    // Get all pending overtime requests
    const pendingOvertimeRequests = await Overtime.find({
      status: "pending",
    }).populate("user");

    // Get all pending reimbursement requests
    const pendingReimbursementRequests = await Reimbursment.find({
      status: "pending",
    }).populate("user");

    // Find HR user
    const hr = await HR.findOne({ role: "hr" });

    // Send email notifications for pending overtime requests
    pendingOvertimeRequests.forEach((overtimeRequest) => {
      const mailOptions = {
        from: process.env.EMAIL_SERVER_USER,
        to: hr.email,
        subject: "Approval Request - Overtime",
        html: `<h1>Approval Request - Overtime</h1>
          <p>Employee: ${overtimeRequest.user.name}</p>
          <p>Start Time: ${overtimeRequest.start_time}</p>
          <p>End Time: ${overtimeRequest.end_time}</p>
          <p>Reason: ${overtimeRequest.reason}</p>
          `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    // Send email notifications for pending reimbursement requests
    pendingReimbursementRequests.forEach((reimbursementRequest) => {
      const mailOptions = {
        from: process.env.EMAIL_SERVER_USER,
        to: hr.email,
        subject: "Approval Request - Reimbursment",
        html: `<h1>Approval Request - Reimbursment</h1>
          <p>Employee: ${reimbursementRequest.user.name}</p>
          <p>Amount: ${reimbursementRequest.amount}</p>
          <p>Description: ${reimbursementRequest.reason}</p>
          `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
    console.log("Emails sent");
  } catch (error) {
    console.log(error);
  }
});

//export cron
module.exports = { emailNotif };
