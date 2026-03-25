import path from "path";
import dotenv from "dotenv";

/**
 * Load `.env` from the project root before other modules read `process.env`.
 */
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
