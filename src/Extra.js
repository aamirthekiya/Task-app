// const bcrypt = require("bcryptjs");
// const myFunc = async () => {
//   const password = "Abc1234!";
//   const hashed = await bcrypt.hash(password, 8);
//   console.log(hashed);
//   const isSame = await bcrypt.compare("Abc1234!", hashed);
//   console.log(isSame);
// };
// myFunc();

// const jwt = require("jsonwebtoken");
// const myFunc = async () => {
//   const token = jwt.sign({ id: "abc123" }, "justverfying", {
//     expiresIn: "7 days",
//   });
//   console.log(token);
//   const data = jwt.verify(token, "justverfying");
//   console.log(data);
// };
// myFunc();

// // index.js --> Express Middleware practice.
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request is not possible now");
//   }
//   next();
// });

// Making relationship between User and Task.
const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  const task = await Task.findById("5f915ec6d8c2d22da403fed3");
  await task.populate("owner").execPopulate(); // Populate is feild which we ahve to relate.
  console.log(task.owner);
};
main();

const main = async () => {
  const user = await User.findById("5f915cb818ec86101cc92c7b");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks); // task is not property but virtual field created by mongoose.
};
main();

// Upload Images
const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      cb(new Error("please upload doc or docx"));
    }
    cb(undefined, true);
  },
});
app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);
