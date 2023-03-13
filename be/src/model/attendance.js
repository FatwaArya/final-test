const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    time_in: {
      type: Date,
      validate: (value) => {
        //min time in is 10am
        if (value.getHours() < 10) {
          throw new Error({ error: "Invalid Time In" });
        }
      },
    },
    time_out: {
      type: Date,
      validate: (value) => {
        // max time out is 6pm
        if (value.getHours() > 20) {
          throw new Error({ error: "Invalid Time Out" });
        }
      },
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
