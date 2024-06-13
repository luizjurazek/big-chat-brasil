import { Router } from "express";
import errorHandle from "../middleware/errorHandle";
import Controller from "../controllers/clientController";

const router: Router = Router();
const ClientController = new Controller();

router.post("/create-client", ClientController.createClient);
router.get("/get-info-client/:id", ClientController.getClient);
router.get("/check-balance/:id", ClientController.checkBalance);
router.put("/add-credit", ClientController.addCredit);
router.put("/alter-plan", ClientController.alterPlan);
router.put("/alter-limit", ClientController.alterLimitOfClient);

router.use(errorHandle);

export default router;
