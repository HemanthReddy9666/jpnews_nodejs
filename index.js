// Load environment variables from the correct .env file based on NODE_ENV
const dotenv = require('dotenv');
const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
dotenv.config({ path: envFile });

const express = require("express");
const morgan = require("morgan");
const moment = require("moment");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./config/config");
const routes = require("./routes/router");

const app = express();

app.use(cors({ origin: "*" }));

// ✅ Replace body-parser with Express’s built-in methods:
app.use(express.text({ limit: config.BodyParserLimit }));
app.use(express.raw({ limit: config.BodyParserLimit }));
app.use(express.json({ limit: config.BodyParserLimit }));
app.use(express.urlencoded({
  extended: true,
  limit: config.BodyParserLimit,
  parameterLimit: config.ParameterLimit
}));

morgan.token("customTime", () => {
  return moment().utcOffset(config.MAIN_APP_TIME_OFFSET).format(config.Common_Date_Time_Format);
});
app.use(morgan(":customTime :method :status :url :response-time ms"));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello JPNews");
});

app.use("/", routes);

// MongoDB Connection
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.listen(config.port, () => {
  console.log(`JPNews server running on ${config.port}`);
});
