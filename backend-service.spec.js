const { integration } = require("./tests-setup");
const { saveSubscription } = require("./backend-service");

const { Tester } = integration();

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2023-03-15T14:31Z").getTime());
});

describe("save-subscription", () => {
  test("save to empty file", () => {
    const subscription = {
      endpoint: "https://push-service.com/asd",
      expirationTime: null,
      keys: {
        p256dh: "bfd",
        auth: "atT",
      },
    };

    saveSubscription(subscription);

    expect(Tester.grabSubscriptions()).toEqual({
      "https://push-service.com/asd": {
        date: "2023-03-15T14:31:00.000Z",
        subscription: {
          endpoint: "https://push-service.com/asd",
          expirationTime: null,
          keys: { p256dh: "bfd", auth: "atT" },
        },
      },
    });
  });

  test("save to non empty file", () => {
    Tester.haveSubscription("lolek", "2023-03-15T10:31:00.000Z");

    const subscription = {
      endpoint: "https://push-service.com/asd",
      expirationTime: null,
      keys: { p256dh: "bfd", auth: "atT" },
    };

    saveSubscription(subscription);

    expect(Tester.grabSubscriptions()).toEqual({
      "https://push-service.com/lolek": {
        date: "2023-03-15T10:31:00.000Z",
        subscription: {
          endpoint: "https://push-service.com/lolek",
          expirationTime: null,
          keys: { p256dh: "xxx-lolek", auth: "atT" },
        },
      },
      "https://push-service.com/asd": {
        date: "2023-03-15T14:31:00.000Z",
        subscription: {
          endpoint: "https://push-service.com/asd",
          expirationTime: null,
          keys: { p256dh: "bfd", auth: "atT" },
        },
      },
    });
  });
});
