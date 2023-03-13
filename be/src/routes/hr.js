const express = require("express");
const HR = require("../model/user");
const Attendance = require("../model/attendance");
const Overtime = require("../model/overtime");
const Reimbursment = require("../model/reimbursment");
const Announcement = require("../model/announcement");
const router = express.Router();
const auth = require("../middleware/auth");
const { transporter } = require("./user");
const multer = require("multer");
const xlsx = require("xlsx");
const { redisClient } = require("../db/redis");

//upload excel file
const upload = multer({
  //limits to 5mb
  limits: {
    fileSize: 5000000,
  },
  // fileFilter(req, file, cb) {
  //   if (file.originalname.match(/\.(xlsx)$/)) {
  //     return cb(new Error("Please upload an excel file"));
  //   }
  //   cb(undefined, true);
  // },
  dest: "uploads",
});

//approve overtime
router.patch("/overtime/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const overtime = await Overtime.findOne({ _id: req.params.id }).populate(
      "user"
    );

    overtime.status = "approved";
    await overtime.save();
    //send email to employee
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: overtime.user.email,
      subject: "Overtime Request Approved",
      text: `Hi ${overtime.user.name}, your overtime request has been approved. Please login to your account to view details.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({ overtime, info });
      }
    });
  } catch (error) {
    res.status(500).send();
  }
});

//reject overtime
router.patch("/overtime/reject/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const overtime = await Overtime.findOne({ _id: req.params.id }).populate(
      "user"
    );

    overtime.status = "rejected";
    await overtime.save();
    //send email to employee
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: overtime.user.email,
      subject: "Overtime Request Rejected",
      text: `Hi ${overtime.user.name}, your overtime request has been rejected. Please login to your account to view details.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({ overtime, info });
      }
    });
  } catch (error) {
    res.status(500).send();
  }
});

//approve reimbursment
router.patch("/reimbursment/:id", auth, async (req, res) => {
  //check if hr
  console.log(req.params.id);
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const reimbursment = await Reimbursment.findOne({
      _id: req.params.id,
    }).populate("user");

    reimbursment.status = "approved";
    await reimbursment.save();
    //send email to employee
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: reimbursment.user.email,
      subject: "Reimbursment Request Approved",
      text: `Hi ${reimbursment.user.name}, your reimbursment request has been approved. Please login to your account to view details.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        res.send({ reimbursment, info });
      }
    });
    res.send(reimbursment);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

//reject reimbursment
router.patch("/reimbursment/reject/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const reimbursment = await Reimbursment.findOne({
      _id: req.params.id,
    }).populate("user");

    reimbursment.status = "rejected";
    await reimbursment.save();
    //send email to employee
    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: reimbursment.user.email,
      subject: "Reimbursment Request Rejected",
      text: `Hi ${reimbursment.user.name}, your reimbursment request has been rejected. Please login to your account to view details.`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({ reimbursment, info });
      }
    });
  } catch (error) {
    res.status(500).send();
  }
});

//get overtime history
router.get("/overtime", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    redisClient.get("overtime-history", async (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      if (result) return res.send(JSON.parse(result));
      const overtime = await Overtime.find().populate("user");
      redisClient.setex("overtime-history", 3600, JSON.stringify(overtime));
      res.send(overtime);
    });
  } catch (error) {
    res.status(500).send();
  }
});
//test redis
//get reimbursment history
router.get("/reimbursment", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    await redisClient.get("reimbursment-history", async (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      if (result) return res.send(JSON.parse(result));
      const reimbursment = await Reimbursment.find().populate("user");
      redisClient.setex(
        "reimbursment-history",
        3600,
        JSON.stringify(reimbursment)
      );
      res.send(reimbursment);
    });
  } catch (error) {
    res.status(500).send();
  }
});

//get attendance history
router.get("/attendance", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    await redisClient.get("attendance-history", async (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      if (result.length < 0) return res.send(JSON.parse(result));
      const attendance = await Attendance.find().populate("user");
      redisClient.setex("attendance-history", 3600, JSON.stringify(attendance));
      res.send(attendance);
    });
  } catch (error) {
    res.status(500).send();
  }
});

//get employee list
router.get("/employee", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const employee = await HR.find({ role: "employee" });
    res.send(employee);
  } catch (error) {
    res.status(500).send();
  }
});

//upload announcement
router.post(
  "/announcement/file",
  upload.single("file"),
  auth,
  async (req, res) => {
    //   if (req.user.role !== "hr") {
    //     return res.status(401).send({ error: "Not authorized" });
    //   }
    try {
      console.log(req.file);
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      sheetData.forEach(async (data) => {
        const announcement = new Announcement({
          ...data,
        });
        await announcement.save();
      });
      res.send(sheetData);
    } catch (error) {
      console.log(error.message);
      res.status(500).send();
    }
  }
);

//crud announcement
router.post("/announcement", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const announcement = new Announcement({
      ...req.body,
    });
    await announcement.save();
    res.send(announcement);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.get("/announcement", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    await redisClient.get("announcement-hr", async (err, result) => {
      if (err) return res.status(500).send({ error: err.message });
      if (result.length < 0) return res.send(JSON.parse(result));
      const announcement = await Announcement.find();
      redisClient.setex("announcement-hr", 3600, JSON.stringify(announcement));
      res.send(announcement);
    });
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/announcement/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
    });
    if (announcement) {
      return res.status(404).send({ error: "Not found" });
    }
    res.send(announcement);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/announcement/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
    });
    if (announcement) {
      return res.status(404).send({ error: "Not found" });
    }
    announcement.title = req.body.title;
    announcement.description = req.body.description;
    await announcement.save();
    res.send(announcement);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/announcement/:id", auth, async (req, res) => {
  //check if hr
  if (req.user.role !== "hr") {
    return res.status(401).send({ error: "Not authorized" });
  }
  try {
    const announcement = await Announcement.findOne({
      _id: req.params.id,
    });
    if (announcement) {
      return res.status(404).send({ error: "Not found" });
    }
    await announcement.remove();
    res.send(announcement);
  } catch (error) {
    res.status(500).send();
  }
});

const hrRouter = router;
module.exports = { hrRouter };
