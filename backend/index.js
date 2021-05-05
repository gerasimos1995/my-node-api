const app = require("./app");
const Logger = require("./util/logger");

const PORT = "3000";

app.listen(PORT, () => {
  Logger.info("Server up and running on port: " + PORT);
});
