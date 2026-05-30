import express from "express";
import metricsService from "../services/metrics.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.set("Content-Type", metricsService.getMetricsContentType());
    res.end(await metricsService.getMetrics());
});

router.get("/stats", async (req, res) => {
    res.status(200).json(await metricsService.getStats());
});

export default router;