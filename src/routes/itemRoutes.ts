import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import {
  getImages,
  getSearchResults,
  getAutosearchResults,
  insertCart,
  getCartItems,
} from "../controllers/itemController.ts";

const router = Router();

router.get("/search", getSearchResults);
router.get("/autocomplete", getAutosearchResults);
router.get("/img", getImages);
router.get("/cart", getCartItems);
router.post("/cart", authMiddleware, insertCart);

export default router;
