import { Router } from "express";
import { showWallets } from "../controller/interfaceController"

const router = Router();
router.get("/wallets", showWallets);

export default router