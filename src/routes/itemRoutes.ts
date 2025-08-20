import { Router } from "express";
import {
  getImages,
  getSearchResults,
  getAutosearchResults,
} from "../controllers/itemController.ts";

const router = Router();

router.get("/search", getSearchResults);
router.get("/autocomplete", getAutosearchResults);
router.get("/img", getImages);

export default router;
