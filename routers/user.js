const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    const savedUser = await User.findOne({ email });
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that mail" });
    }

    const user = new User(req.body);
    await user.save();
    console.log(user);
    res.status(201).json({ message: "saved successful" });
  } catch (error) {
    res.status(422).json({ error });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ message: "You are logged in", user, token });
  } catch (e) {
    res.status(422).json({ error: "Unable to login" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.json({ msg: "Successfully Logged out!" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ msg: "Successfully Logged out of all instances!" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.json({ message: req.user });
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  console.log(isValidOperation);
  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid Request" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    console.log(req.user);
    await req.user.save();
    res.json({ message: req.user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: req.user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
