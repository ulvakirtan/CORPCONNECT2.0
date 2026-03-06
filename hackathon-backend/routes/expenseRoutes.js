import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createEXPENSE,
  getEXPENSES,
  getEXPENSEById,   // ← was missing from routes
  updateEXPENSE,
  deleteEXPENSE
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", protect, createEXPENSE);
router.get("/", protect, getEXPENSES);
router.get("/:id", protect, getEXPENSEById);  // ← was missing
router.put("/:id", protect, updateEXPENSE);
router.delete("/:id", protect, deleteEXPENSE);

export default router;