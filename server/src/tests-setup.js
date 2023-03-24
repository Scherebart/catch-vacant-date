const path = require("path");
const fs = require("fs");

const config = require("./config");
config.pushServiceSubscriptionsFile = "push-service-subscriptions.test.json";

const SUBSCRIPTIONS_FILE_PATH = path.join(
  __dirname,
  config.pushServiceSubscriptionsFile
);

exports.integration = () => {
  afterEach(async () => {
    fs.rmSync(SUBSCRIPTIONS_FILE_PATH, { force: true });
  });

  function grabSubscriptions() {
    try {
      return JSON.parse(
        fs.readFileSync(SUBSCRIPTIONS_FILE_PATH, {
          encoding: "utf8",
          flag: "r",
        })
      );
    } catch (err) {
      return {};
    }
  }

  function haveSubscription(userId, date) {
    const subscription = {
      endpoint: `https://push-service.com/${userId}`,
      expirationTime: null,
      keys: {
        p256dh: `xxx-${userId}`,
        auth: "atT",
      },
    };

    const subscriptions = grabSubscriptions();
    subscriptions[subscription.endpoint] = {
      date,
      subscription,
    };
    fs.writeFileSync(SUBSCRIPTIONS_FILE_PATH, JSON.stringify(subscriptions), {
      encoding: "utf8",
      flag: "w",
    });

    return subscription;
  }

  return {
    Tester: {
      grabSubscriptions,
      haveSubscription,
    },
  };
};
