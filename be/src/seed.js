const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/db_final_test");

const Menu = require("./model/menu");
const ObjectId = require("mongoose").Types.ObjectId;

const menuData = [
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3d7"),
    name: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
    parent: null,
    order: 1,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3d8"),
    name: "Profile",
    icon: "person",
    link: "/profile",
    parent: null,
    order: 2,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3d9"),
    name: "Announcements",
    icon: "announcement",
    link: "/announcements",
    parent: null,
    order: 3,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3da"),
    name: "Create Announcement",
    icon: "",
    link: "/announcements/create",
    parent: new ObjectId("615dfb1cbb8a7d156d3fc3d9"),
    order: 1,
    roles: ["hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3db"),
    name: "View Announcements",
    icon: "",
    link: "/announcements/view",
    parent: new ObjectId("615dfb1cbb8a7d156d3fc3d9"),
    order: 2,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3dc"),
    name: "Attendance",
    icon: "calendar",
    link: "/attendance",
    parent: null,
    order: 4,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3dd"),
    name: "Overtime Request",
    icon: "time",
    link: "/overtime",
    parent: null,
    order: 5,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3de"),
    name: "Reimbursement Request",
    icon: "money",
    link: "/reimbursement",
    parent: null,
    order: 6,
    roles: ["user", "hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3df"),
    name: "Approval",
    icon: "",
    link: "/approval",
    parent: new ObjectId("615dfb1cbb8a7d156d3fc3dd"),
    order: 1,
    roles: ["hr"],
  },
  {
    _id: new ObjectId("615dfb1cbb8a7d156d3fc3e0"),
    name: "History",
    icon: "",
    link: "/history",
    parent: new ObjectId("615dfb1cbb8a7d156d3fc3dd"),
    order: 2,
    roles: ["user", "hr"],
  },
];

const seedMenu = async () => {
  try {
    const menu = await Menu.find({});
    if (menu.length === 0) {
      menuData.forEach(async (item) => {
        const menu = new Menu(item);
        await menu.save();
      });
    }
  } catch (error) {
    console.log(error);
  }
  //   console.log(`${menuItems.length} menu items seeded`);
};

seedMenu();
