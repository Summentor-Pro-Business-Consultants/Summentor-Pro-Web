import { Router } from "express";
import * as trackController from "./track.controller.ts";

const router = Router();

// POST /track — record a page view (public, no auth)
router.post("/", trackController.track);

export default router;
