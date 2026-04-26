import { Response, Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getDashboardSummary } from "../services/dashboard.service";
import { AuthRequest } from "../types";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const summary = await getDashboardSummary(req.doctor!.id);
  res.status(200).json(summary);
});

export default router;
