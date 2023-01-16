const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.statics.findByCredentials = async (email, pass) => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log("entered");
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    console.log("entered");
    throw new Error("Unable to login");
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  console.log(user);
  const token = jwt.sign({ _id: user._id.toString() }, "maharsh");
  console.log(token);
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
