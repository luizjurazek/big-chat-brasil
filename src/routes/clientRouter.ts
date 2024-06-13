import { Router } from "express";
import errorHandle from "../middleware/errorHandle";
import Controller from "../controllers/clientController";

const router: Router = Router();
const ClientController = new Controller();

router.post("/create-client", ClientController.createClient);
router.get("/get-info-client/:id", ClientController.getClient);
router.get("/check-balance/:id", ClientController.checkBalance);
router.patch("/add-credit", ClientController.addCredit);
router.patch("/alter-plan", ClientController.alterPlan);
router.patch("/alter-limit", ClientController.alterLimitOfClient);

router.use(errorHandle);

export default router;
