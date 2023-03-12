const express = require("express");
const app = express();
const { userRouter } = require("./routes/user");
const { hrRouter } = require("./routes/hr");
const { menuRouter } = require("./routes/menu");
require("dotenv").config({ path: "./.env" });
require("./db/mongoose");

//seed menu data

const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(userRouter);
app.use(hrRouter);
app.use(menuRouter);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
