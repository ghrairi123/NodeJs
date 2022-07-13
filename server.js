const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require("body-parser");
const authRoutes = require("./Routes/AuthRoute");
const cookieParser = require("cookie-parser");
//connect db
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
mongoose.connect(
  //process.env.MONGODB_URI || "mongodb://localhost:27017/bijoycrm",
  "mongodb://localhost:27017/Project?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Mongodb connection succeeded.");
    else
      console.log(
        "Error while connecting MongoDB : " + JSON.stringify(err, undefined, 2)
      );
  }
);
//routes

app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});
app.listen(PORT, () => {
  console.log(`Server is starting at PORT: ${PORT}`);
});
