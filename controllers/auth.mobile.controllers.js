import supabase from "../db/supabase.js";
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";
import crypto from "crypto";

const HASH_REGEX = /^[0-9a-f]{64}$/i;

const normalizePassword = (value = "") => {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }

    if (HASH_REGEX.test(trimmed)) {
        return trimmed.toLowerCase();
    }

    return crypto.createHash("sha256").update(trimmed).digest("hex");
};

const mobileLoginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(new ApiError(400, "Email and password required"));

    const hashedPassword = normalizePassword(password);
    if (!hashedPassword) {
        return res.status(400).json(new ApiError(400, "Invalid password value"));
    }
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
        .from("teachers")
        .select("id, name, email")
        .eq("email", normalizedEmail)
        .eq("password_hash", hashedPassword)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return res.status(401).json(new ApiError(401, "Invalid login credentials"));
        }
        return res.status(500).json(new ApiError(500, error.message || "Unable to login"));
    }

    return res.status(200).json(new ApiResponse(200, data, "Login successful"));
};

export { mobileLoginController };
