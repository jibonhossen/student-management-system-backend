import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";

const healthCheckController = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200,{message: "Server is running!"}));
});

export default healthCheckController;