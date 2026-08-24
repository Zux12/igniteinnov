(function () {
  "use strict";

  const LEAD_URL =
    "https://script.google.com/macros/s/AKfycbzJzI8TvsjnYVvLXZW49wpJJaaGhakDQPdtTBw6IRaeJ8z0N5slDuirPoZF4Ky6KFZ8nw/exec";

  const form = document.getElementById("igniteLeadForm");

  if (!form) {
    return;
  }

  const submitButton = document.getElementById("contactSubmitButton");
  const status = document.getElementById("contactStatus");

  function getVisitorId() {
    try {
      return localStorage.getItem("igniteVisitorId") || "";
    } catch (error) {
      return "";
    }
  }

  function getCampaign() {
    const params = new URLSearchParams(window.location.search);

    return (
      params.get("utm_campaign") ||
      params.get("campaign") ||
      ""
    );
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const company = document.getElementById("company").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent =
        "Please complete your name, email and message.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.textContent = "Sending your enquiry...";

    const payload = {
      type: "lead",
      name: name,
      company: company,
      email: email,
      phone: phone,
      service: service,
      message: message,
      sourcePage: window.location.href,
      campaign: getCampaign(),
      visitorId: getVisitorId()
    };

    try {
      const response = await fetch(LEAD_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      window.location.href = "/contact-success.html";

    } catch (error) {
      console.error("Lead submission error:", error);

      status.textContent =
        "Sorry, we could not send your enquiry. Please try again or contact us by WhatsApp.";

      submitButton.disabled = false;
      submitButton.textContent = "Send Enquiry";
    }
  });
})();
