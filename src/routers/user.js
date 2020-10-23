const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user.js");
const auth = require("../middleware/auth");
const { sendWelcomeEmail } = require("../emails/account");
const { sendCancelationEmail } = require("../emails/account");
const router = express.Router();

// ==============================================
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save(); // Mongoose change that object
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    // console.log(token);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ e });
  }
  // user
  //   .save()
  //   .then(() => {
  //     res.status(201).send(user);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Middleware for file upload.
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("Please upload image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error();
    }

    res.set("Content-type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send();
  }
});

// router.delete("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findByIdAndDelete(_id);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// const router = express.Router();
// router.get("/test", (req, res) => {
//   res.send("New page from another file");
// });

module.exports = router;
