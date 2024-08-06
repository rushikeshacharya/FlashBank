import express from "express";

const router = express.Router();
import bankRouter from "./bank.route.js";
import userRouter from "./user.route.js";

router.get("/", (req, res) => {
  return res.status(200).send("Default Route");
});
const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/bank",
    route: bankRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
