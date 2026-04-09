import { ApiRequest } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-Handler.js";

const healthCheck = asyncHandler(async (req, res) => {
    const response = new ApiRequest(200, "API is healthy");
    res.status(response.statusCode).json(new ApiRequest(200, {message: "API is healthy"}));
});
 
export {healthCheck};