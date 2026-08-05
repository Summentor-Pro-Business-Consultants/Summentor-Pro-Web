import { Router } from "express";
import * as trackController from "./track.controller.ts";

const router = Router();

// POST /track — record a page view (public, no auth)
router.post("/", trackController.track);

// POST /track/event — record a behavioural event: CTA click, scroll depth,
// or a form funnel step (public, no auth)
router.post("/event", trackController.trackEvent);

export default router;
