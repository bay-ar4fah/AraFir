import { Router } from "express";

import {
  systemStatus,
} from "../controllers/statusController";

const router = Router();

router.get("/", systemStatus);

export default router;