import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createEXPENSE,
  getEXPENSES,
  updateEXPENSE,
  deleteEXPENSE
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", protect, createEXPENSE);
router.get("/", protect, getEXPENSES);
router.put("/:id", protect, updateEXPENSE);
router.delete("/:id", protect, deleteEXPENSE);

export default router;