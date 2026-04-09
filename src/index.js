import dotenv from "dotenv";
import app from "./app.js";
import { AvailableTaskStatus } from "./utils/constants.js";

dotenv.config({
    path: "./.env",
});


let port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});




