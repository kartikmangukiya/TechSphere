import { Router } from "express";
import { subscribe } from "../controllers/subscribe.controller.js";

const subscribeRouter = Router();

subscribeRouter.post("/", subscribe);

export default subscribeRouter;