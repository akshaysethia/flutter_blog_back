var express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

const userRoutes = require("./routes/user_route");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected To Mongo DB !");
  })
  .catch((err) => {
    console.log("Error Occured: ", JSON.stringify(err));
  });

app.get("/", (req, res) => {
  res.json({ success: true, message: "First Route !" });
});

app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at Port: http://localhost:${process.env.PORT}`);
});
