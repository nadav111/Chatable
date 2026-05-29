import express from "express";
import metricsService from "../services/metrics.service.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.set("Content-Type", metricsService.getMetricsContentType());
    res.end(metricsService.getMetrics());
});

router.get("/stats", (req, res) => {
    res.status(200).json(metricsService.getStats());
});

export default router;