const express = require("express");
const router = express.Router();
const Menu = require("../model/menu");
const auth = require("../middleware/auth");

//get all menu
router.get("/menu", auth, async (req, res) => {
  try {
    console.log(req.hr.role);
    const menu = await Menu.find({
      roles: {
        $in: [req.hr.role === undefined ? "hr" : req.hr.role],
      },
    });
    res.send(menu);
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

const menuRouter = router;
module.exports = { menuRouter };
