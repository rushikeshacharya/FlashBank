import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";
import connectDB from "./utils/connect-mongo.utils.js";

const PORT = process.env.PORT || 3000;

const app = express();
connectDB("mongodb://127.0.0.1:27017/flash-bank").then(() => {
  console.log("Connected to mongo");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use(router);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
};

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
