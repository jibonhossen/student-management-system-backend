import { Router } from "express";
import supabaseController from "../controllers/supabase.controllers.js";

const router = Router();

router.route("/").get(supabaseController);

export default router;