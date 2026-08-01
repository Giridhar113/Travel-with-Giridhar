const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
require("dotenv").config();

const app = require("./app");
const { ensureDatabase } = require("./config/db");

const port = process.env.PORT || 5000;

ensureDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Travel with Giridhar API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
