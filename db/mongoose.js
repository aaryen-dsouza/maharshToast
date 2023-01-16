const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://aaryen:hahahee@cluster0.6ltzhmk.mongodb.net/maharsh-toast-api?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// mongodb://127.0.0.1:27017/maharsh-toast-api
