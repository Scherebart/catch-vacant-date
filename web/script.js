import { fetchLatestVacancies } from "./utils.js";

const CLIENT_SCRIPT_VER = 31;

console.log(`from the client script ${CLIENT_SCRIPT_VER}`);

const checkCaps = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }

  console.log(
    "Successfully detected the serviceWorker and Push manager capabilities!"
  );
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.

  return permission;
};

let errorMessage = null;
let successMessage = null;
let requestPending = null;

let latestVacancies = [];
let checkDate = null;

navigator.serviceWorker.addEventListener("message", async (event) => {
  const {
    data: { data, type },
  } = event;
  if (type === "error") {
    errorMessage = "Some error occured in service worker";
  } else if (type === "fresh-data") {
    ({ checkDate, latestVacancies } = data);
  }
  refreshUI();
});

function refreshUI() {
  const button = document.getElementById("permission-btn");
  const successMessageBox = document.getElementById("success-message");
  const errorMessageBox = document.getElementById("error-message");

  button.style.display = requestPending ? "block" : "none";
  successMessageBox.style.display = successMessage ? "block" : "none";
  successMessageBox.textContent = successMessage;
  errorMessageBox.style.display = errorMessage ? "block" : "none";
  errorMessageBox.textContent = errorMessage;

  let checkDateFormatted = null;
  if (checkDate) {
    checkDateFormatted = new Intl.DateTimeFormat("pl-PL").format(
      new Date(checkDate)
    );
    checkDateFormatted = new Date(checkDate).toLocaleString("pl-PL");
  }
  const vacanciesBox = document.getElementById("vacancies");
  vacanciesBox.replaceChildren();
  const checkDateHeader = document.createElement("div");
  checkDateHeader.id = "check-date";
  checkDateHeader.textContent = checkDateFormatted ?? "Brak sprawdzeń";
  vacanciesBox.appendChild(checkDateHeader);
  if (checkDateFormatted) {
    if (latestVacancies.length > 0) {
      for (const vacancy of latestVacancies) {
        const vacancyItem = document.createElement("div");
        vacancyItem.className = "vacancy";
        vacancyItem.innerText = vacancy;
        vacanciesBox.appendChild(vacancyItem);
      }
    } else {
      const vacancyItem = document.createElement("div");
      vacancyItem.className = "vacancy";
      vacancyItem.innerText = "brak wolnych terminów";
      vacanciesBox.appendChild(vacancyItem);
    }
  }
}

function checkUserPermission() {
  if (window.Notification.permission === "denied") {
    requestPending = false;
    errorMessage = "You have denied subscribtion to the service.";
  } else if (window.Notification.permission === "granted") {
    requestPending = false;
    successMessage = "You have succesfully subscribed to the service!";
  } else {
    requestPending = true;
  }
}

async function registerOrUnregisterServiceWorker() {
  console.log(window.Notification.permission);
  if (window.Notification.permission === "granted") {
    console.log("1");
    const swRegistration = await navigator.serviceWorker.register(
      "service.js",
      { type: "module" }
    );
  } else {
    console.log("2");
    const swRegistration = await navigator.serviceWorker.getRegistration();
    console.log({ swRegistration });
    if (swRegistration) {
      console.log("3");
      swRegistration.active.postMessage({ type: "unregister" });
    }
    console.log("4");
  }
}

async function main() {
  try {
    const res = await fetch("/vapid-key");
    const { publicKey } = res.json();
    console.log({publicKey})

    document
      .getElementById("permission-btn")
      .addEventListener("click", enableNotifications);

    checkCaps();
    checkUserPermission();
    await registerOrUnregisterServiceWorker();
    ({ checkDate, latestVacancies } = await fetchLatestVacancies());
    console.log(latestVacancies);
  } catch (err) {
    errorMessage = err.message;
  }
  refreshUI();
}

async function enableNotifications() {
  try {
    await requestNotificationPermission();
    await registerOrUnregisterServiceWorker();
    checkUserPermission();
  } catch (err) {
    errorMessage = err.message;
  }
  refreshUI();
}


main();
