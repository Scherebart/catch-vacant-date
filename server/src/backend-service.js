const path = require("path");
const fs = require("fs");
const webpush = require("web-push");
const { Mutex } = require("async-mutex");

const { pushServiceSubscriptionsFile, vapidKeysFile } = require("../config");

const VAPID_KEYS = JSON.parse(
  fs.readFileSync(vapidKeysFile, { encoding: "utf8" })
);
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

const mutex = new Mutex();

async function processSubscriptionsMap(func) {
  await mutex.acquire();

  const subscriptionsMapRaw = fs.readFileSync(pushServiceSubscriptionsFile, {
    flag: "a+",
    encoding: "utf8",
  });
  const subscriptionsMap = subscriptionsMapRaw
    ? JSON.parse(subscriptionsMapRaw)
    : {};
  const changedSubscriptionMap = await func(subscriptionsMap);
  fs.writeFileSync(
    pushServiceSubscriptionsFile,
    JSON.stringify(changedSubscriptionMap),
    {
      flag: "w",
      encoding: "utf8",
    }
  );

  await mutex.release();
}

// function saveSubscription(subscription) {
//   const subscriptionsMapRaw = fs.readFileSync(SUBSCRIPTIONS_FILE_PATH, {
//     flag: "a+",
//     encoding: "utf8",
//   });

//   let subscriptions;
//   try {
//     subscriptions = JSON.parse(subscriptionsMapRaw);
//   } catch (err) {
//     subscriptions = {};
//   }

//   subscriptions[subscription.endpoint] = {
//     date: new Date().toISOString(),
//     subscription,
//   };

//   fs.writeFileSync(SUBSCRIPTIONS_FILE_PATH, JSON.stringify(subscriptions), {
//     flag: "w",
//     encoding: "utf8",
//   });

//   console.log("saved", subscription, `to ${SUBSCRIPTIONS_FILE_PATH}`);
// }

module.exports = {
  saveSubscription: (subscription) =>
    processSubscriptionsMap((subscriptionsMap) => {
      console.log("saving subscription", subscription);
      subscriptionsMap[subscription.endpoint] = {
        date: new Date().toISOString(),
        subscription,
      };

      return subscriptionsMap;
    }),
  notifySubscribers: () =>
    processSubscriptionsMap(async (subscriptionsMap) => {
      const keysForDeletion = [];
      for (const [key, { date, subscription }] of Object.entries(
        subscriptionsMap
      )) {
        try {
          console.log("sending notification to", date, subscription);
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: "Nowe terminy!",
              body: "Sprawdź nowe terminy!",
            })
          );
        } catch (err) {
          console.error("error while sending push request", err);
          console.log("removing subscription", date, subscription);

          keysForDeletion.push(key);
        }
      }

      for (const key of keysForDeletion) {
        delete subscriptionsMap[key];
      }

      return subscriptionsMap;
    }),
};
