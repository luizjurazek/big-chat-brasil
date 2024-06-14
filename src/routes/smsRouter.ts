import { Router } from "express";
import errorHandle from "../middleware/errorHandle";
import Controller from "../controllers/smsController";

const router: Router = Router();
const SMSController = new Controller();

router.post("/send-message", SMSController.sendMessage);

router.use(errorHandle);

export default router;
