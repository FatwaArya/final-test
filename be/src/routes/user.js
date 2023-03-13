const express = require("express");
const User = require("../model/user");
const Attendance = require("../model/attendance");
const Overtime = require("../model/overtime");
const Reimbursment = require("../model/reimbursment");
const Announcement = require("../model/announcement");
const router = express.Router();
const auth = require("../middleware/auth");
const nodeMailer = require("nodemailer");
const { redisClient } = require("../db/redis");

const transporter = nodeMailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5a6bb522eeb767",
    pass: "b327643b6d56a3",
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

//new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//login user
router.post("/users/login", async (req, res) => {
  //IMPORTANT
  const field = Object.keys(req.body);
  const allowedField = ["username", "email", "password"];
  const isValidOperation = field.every((field) => allowedField.includes(field));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid login field" });
  }
  if (field.length > 2) {
    return res.status(400).send({ error: "Invalid login field" });
  }

  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

//request for overtime
router.post("/users/overtime", auth, async (req, res) => {
  const { startTime, endTime, reason } = req.body;
  try {
    //find user with role hr and send email
    const hr = await User.findOne({ role: "hr" });
    console.log(req.user);
    const overtimeRequest = new Overtime({
      user: req.user._id,
      date: new Date(),
      start_time: startTime,
      end_time: endTime,
      reason: reason,
      status: "pending",
    });
    await overtimeRequest.save();
    //send email to hr
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: hr.email,
      subject: "Overtime Request",
      text: `Hi ${hr.name}, ${req.user.name} has requested for overtime. Please login to your account to approve or reject the request.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(201).send({ overtimeRequest, info });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

//request for reimbursment
router.post("/users/reimbursment", auth, async (req, res) => {
  const { amount, reason } = req.body;
  try {
    //find user with role hr and send email
    const hr = await User.findOne({ role: "hr" });
    console.log(req.user);
    const reimbursmentRequest = new Reimbursment({
      user: req.user._id,
      date: new Date(),
      amount: amount,
      reason: reason,
      status: "pending",
    });
    await reimbursmentRequest.save();
    //send email to hr
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: hr.email,
      subject: "Reimbursment Request",
      text: `Hi ${hr.name}, ${req.user.name} has requested for reimbursment. Please login to your account to approve or reject the request.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(201).send({ reimbursmentRequest, info });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});
//get attendance
router.get("/users/attendance", auth, async (req, res) => {
  try {
    // await redisClient.get("attendance", async (err, result) => {
    //   if (err) return res.status(500).send({ error: err.message });
    //   if (result) return res.status(200).send(JSON.parse(result));
    const attendance = await Attendance.find({ user: req.user._id });
    // redisClient.setex("attendance", 3600, JSON.stringify(attendance));
    res.status(200).send(attendance);
    // });
  } catch (error) {
    res.status(500).send();
  }
});
//attendance
router.post("/users/attendance", auth, async (req, res) => {
  const { time_in, time_out } = req.body;
  try {
    //time in and time out can only be done once a day
    const attendance = await Attendance.findOne({
      user: req.user._id,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    });
    if (attendance && attendance.time_in && attendance.time_out) {
      return res.status(400).send({ error: "Attendance already taken" });
    }
    //if time in is not empty, time out must be empty
    if (attendance && attendance.time_in && !attendance.time_out) {
      attendance.time_out = time_out;
      await attendance.save();
      return res.status(201).send({ attendance });
    }

    const attendanceRequest = new Attendance({
      user: req.user._id,
      time_in: time_in,
      time_out: time_out,
    });
    await attendanceRequest.save();

    res.status(201).send({ attendanceRequest });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//get overtime history
router.get("/users/overtime", auth, async (req, res) => {
  try {
    // await redisClient.get("overtime-employee", async (err, result) => {
    //   if (result.length < 0) {
    //     return res.status(200).send(JSON.parse(result));
    //   }
    const overtime = await Overtime.find({ user: req.user._id });
    // redisClient.setex("overtime-employee", 3600, JSON.stringify(overtime));
    res.status(200).send(overtime);
    // });
  } catch (error) {
    res.status(500).send();
  }
});

//get reimbursment history
router.get("/users/reimbursment", auth, async (req, res) => {
  try {
    //cache
    // await redisClient.get("reimbursment-employee", async (err, result) => {
    //   if (result.length < 0) {
    //     return res.status(200).send(JSON.parse(result));
    //   }
    const reimbursment = await Reimbursment.find({ user: req.user._id });
    // redisClient.setex(
    //   "reimbursment-employee",
    //   3600,
    //   JSON.stringify(reimbursment)
    // );
    res.status(200).send(reimbursment);
    // });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//get overtime history
router.get("/users/attendance", auth, async (req, res) => {
  try {
    // await redisClient.get("attendance-employee", async (err, result) => {
    //   if (err) return res.status(500).send({ error: err.message });
    //   if (result) return res.status(200).send(JSON.parse(result));
    const attendance = await Attendance.find({ user: req.user._id });
    // redisClient.setex(
    //   "attendance-employee",
    //   3600,
    //   JSON.stringify(attendance)
    // );
    res.status(200).send(attendance);
    // });
  } catch (error) {
    res.status(500).send();
  }
});

//get announcement
router.get("/users/announcements", auth, async (req, res) => {
  try {
    // await redisClient.get("announcements", async (err, result) => {
    //   if (result) {
    //     return res.status(200).send(JSON.parse(result));
    //   }
    const announcements = await Announcement.find();
    // redisClient.setex("announcements", 3600, JSON.stringify(announcements));
    res.status(200).send(announcements);
    // });
  } catch (error) {
    res.status(500).send();
  }
});

const userRouter = router;

module.exports = { userRouter, transporter };
