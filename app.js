const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const multer = require("multer");
const path = require("path");
const ejs = require("ejs");

require("dotenv").config();

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection Success.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

const app = express();

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

app.use("/users", require("./routes/users"));

app.listen(PORT, () => {
  console.log("Server started listening on PORT : " + PORT);
});

app.set("view engine", "ejs");
app.use(express.static("uploads"));

const questionSchema = new Schema({
  desc1: String,
  desc2: String,
  area: String,
  image: String,
  alternative1: String,
  alternative2: String,
  alternative3: String,
  alternative4: String,
  answer: String,
});

questionModel = mongoose.model("question", questionSchema);
const upload = multer({
  storage: multer.diskStorage({
    distination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
});

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/post", upload.single("image"), (req, res) => {
  console.log(req.file);
  const x = new questionModel();
  x.desc1 = req.body.desc1;
  x.desc2 = req.body.desc2;
  x.area = req.body.area;
  x.image = req.file.filename;
  x.alternative1 = req.body.alternative1;
  x.alternative2 = req.body.alternative2;
  x.alternative3 = req.body.alternative3;
  x.alternative4 = req.body.alternative4;
  x.answer = req.body.answer;

  x.save((err, doc) => {
    if (!err) {
      console.log("saved successfully");
      res.redirect("/questions");
    } else {
      console.log(err);
    }
  });
});

app.get("/questions", (res, req) => {
  questionModel.find().then(function (doc) {
    res.render("question", {
      item: doc,
    });
  });
});
