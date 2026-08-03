(function () {
  "use strict";

  const TRACKING_URL =
    "https://script.google.com/macros/s/AKfycbzJzI8TvsjnYVvLXZW49wpJJaaGhakDQPdtTBw6IRaeJ8z0N5slDuirPoZF4Ky6KFZ8nw/exec";

  const pageOpenedAt = Date.now();

  function createId(prefix) {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      return prefix + "-" + crypto.randomUUID();
    }

    return (
      prefix +
      "-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 12)
    );
  }

  function getVisitorId() {
    const key = "igniteVisitorId";

    try {
      let visitorId = localStorage.getItem(key);

      if (!visitorId) {
        visitorId = createId("VIS");
        localStorage.setItem(key, visitorId);
      }

      return visitorId;
    } catch (error) {
      return createId("VIS");
    }
  }

  function getSessionId() {
    const key = "igniteSessionId";

    try {
      let sessionId = sessionStorage.getItem(key);

      if (!sessionId) {
        sessionId = createId("SES");
        sessionStorage.setItem(key, sessionId);
      }

      return sessionId;
    } catch (error) {
      return createId("SES");
    }
  }

  function getDeviceType() {
    const userAgent = navigator.userAgent || "";

    if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
      return "Tablet";
    }

    if (
      /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(
        userAgent
      )
    ) {
      return "Mobile";
    }

    return "Desktop";
  }

  function getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (error) {
      return "";
    }
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  function buildPayload(eventType, extraData) {
    return {
      visitorId: visitorId,
      sessionId: sessionId,
      eventType: eventType,
      page: window.location.pathname + window.location.search,
      pageTitle: document.title || "",
      referrer: document.referrer || "Direct",
      device: getDeviceType(),
      browserDetails: navigator.userAgent || "",
      language: navigator.language || "",
      screenSize:
        String(window.screen.width) +
        "x" +
        String(window.screen.height),
      timezone: getTimezone(),
      durationSeconds: "",
      clickedElement: "",
      ...(extraData || {})
    };
  }

  function sendEvent(eventType, extraData) {
    const payload = buildPayload(eventType, extraData);

    fetch(TRACKING_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function () {
      // Tracking failure must never affect the website.
    });
  }

  function describeElement(element) {
    if (!element) {
      return "";
    }

    const text = (
      element.innerText ||
      element.textContent ||
      ""
    )
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 150);

    const href = element.getAttribute("href") || "";
    const id = element.id ? "#" + element.id : "";

    let className = "";

    if (
      typeof element.className === "string" &&
      element.className.trim()
    ) {
      className =
        "." +
        element.className
          .trim()
          .replace(/\s+/g, ".");
    }

    return (
      element.tagName +
      id +
      className +
      " | " +
      text +
      " | " +
      href
    ).slice(0, 500);
  }

  document.addEventListener("click", function (event) {
    const clickedElement = event.target.closest(
      "a, button, input[type='submit']"
    );

    if (!clickedElement) {
      return;
    }

    sendEvent("click", {
      clickedElement: describeElement(clickedElement)
    });
  });

  window.addEventListener("load", function () {
    sendEvent("page_view");
  });

  window.addEventListener(
    "pagehide",
    function () {
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - pageOpenedAt) / 1000)
      );

      const payload = buildPayload("page_exit", {
        durationSeconds: durationSeconds
      });

      const blob = new Blob(
        [JSON.stringify(payload)],
        {
          type: "text/plain;charset=utf-8"
        }
      );

      navigator.sendBeacon(TRACKING_URL, blob);
    },
    { once: true }
  );
})();
