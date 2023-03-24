const path = require("path");

const STATE_DIR = path.join(__dirname, "..", "state");
const TEMP_DIR = path.join(__dirname, "..", "temp");
const WEB_DIR = path.join(__dirname, "..", "web");

module.exports = {
  pushServiceSubscriptionsFile: path.join(
    STATE_DIR,
    "push-service-subscriptions.json"
  ),
  updatesDir: path.join(TEMP_DIR, "updates"),
  vapidKeysFile: path.join(STATE_DIR, "vapid-keys.json"),
  webDir: WEB_DIR,
};
