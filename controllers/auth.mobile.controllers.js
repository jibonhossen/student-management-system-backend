import supabase from "../db/supabase.js";
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";

const mobileLoginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(new ApiError(400, 'Email and password required'));
    const { data, error } = await supabase.from('teachers').select('*').eq('email', email).eq('password', password);
    if (error) return res.status(500).json(new ApiError(500, error.message));


    return res.status(200).json(new ApiResponse(200, data, 'Login successful'));
}

export { mobileLoginController }
