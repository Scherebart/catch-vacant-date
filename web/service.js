import { fetchLatestVacancies } from "./utils.js";

const SERVICE_WORKER_VER = 10;

console.log(`from the service worker ${SERVICE_WORKER_VER}`);

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async (subscription) => {
  const response = await fetch("/save-subscription", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  return response.json();
};

const subscribeForNotifications = async () => {
  const res = await fetch("/vapid-key");
  const { publicKey: applicationServerKey } = await res.json();
  console.log({ applicationServerKey });
  const options = { applicationServerKey, userVisibleOnly: true };
  const subscription = await self.registration.pushManager.subscribe(options);
  console.log(JSON.stringify(subscription));
  return subscription;
};

// console.log(self.registration)
self.addEventListener("install", async () => {
  await self.skipWaiting();
  console.log(`new service worker installed ${SERVICE_WORKER_VER}`);
});

async function unregister() {
  await self.registration.unregister();
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    await client.navigate(client.url);
  }
  console.log(`unregistered service worker ${SERVICE_WORKER_VER}`);
}

self.addEventListener("message", async (event) => {
  const {
    data: { type },
  } = event;
  if (type === "unregister") {
    return unregister();
  }
});

self.addEventListener("activate", async () => {
  if (self.Notification.permission !== "granted") {
    return unregister();
  }

  await self.clients.claim();

  try {
    console.log("before subscribing for notifications");
    const subscription = await subscribeForNotifications();
    console.log("subscribed for", subscription);
    const response = await saveSubscription(subscription);
    console.log("persisted subscription", response);
    console.log(`new service worker activated ${SERVICE_WORKER_VER}`);
  } catch (error) {
    console.error("some error occured", error);
    const clients = await self.clients.matchAll();
    console.log(clients);
    for (const client of clients) {
      client.postMessage({ type: "error" });
    }
  }
});

self.addEventListener("push", async function (event) {
  const { data } = event;
  if (data) {
    console.log("Push event!! ", event.data.text());
    const { title, body } = data.json();
    self.registration.showNotification(title, { body });
    let { checkDate, latestVacancies } = await fetchLatestVacancies();
    const clients = await self.clients.matchAll();
    console.log(clients);
    for (const client of clients) {
      client.postMessage({
        type: "fresh-data",
        data: { checkDate, latestVacancies },
      });
    }

    // showLocalNotification("Yolo", event.data.text(),  self.registration);
  } else {
    console.log("Push event but no data");
  }
});
