document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("sheet-form");
  if (!form) return;

  var webhookUrl = form.getAttribute("data-webhook-url");
  var successRedirect = form.getAttribute("data-success-redirect");

  // Phone formatting — reused from BestMesoLawyers pattern
  var phoneInputs = form.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(function (input) {
    input.addEventListener("input", formatPhoneNumber);
    input.addEventListener("blur", validatePhoneNumber);
  });

  function formatPhoneNumber(e) {
    var digits = e.target.value.replace(/\D/g, "");
    if (digits.length === 11 && digits.charAt(0) === "1") {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    var m = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !m[2]
      ? m[1]
      : "(" + m[1] + ") " + m[2] + (m[3] ? "-" + m[3] : "");
  }

  function validatePhoneNumber(e) {
    var digits = (e.target.value.replace(/\D/g, "") || "");
    var isValid = digits.length === 0 || (digits.length === 10 && digits.charAt(0) !== "1");
    var msg = isValid ? "" : "Please enter a valid 10-digit phone number.";
    e.target.setCustomValidity(msg);
    toggleFieldError(e.target, !isValid, msg);
  }

  // Validation
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  function validateForm() {
    var isValid = true;
    var fields = form.querySelectorAll("input, textarea, select");
    fields.forEach(function (field) {
      var error = validateField(field);
      if (error) isValid = false;
    });
    if (!isValid) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
    return isValid;
  }

  function validateField(field) {
    var value = field.value.trim();
    var errorSpan = document.getElementById("error-" + field.name);
    if (!errorSpan) return null;

    var customMsg = errorSpan.getAttribute("data-validation-message");

    // Required check
    if (field.required && !value) {
      var msg = customMsg || "This field is required.";
      toggleFieldError(field, true, msg);
      return msg;
    }

    // Pattern check
    var pattern = field.getAttribute("pattern");
    if (pattern && value && !new RegExp(pattern).test(value)) {
      var msg2 = customMsg || "Please check this field.";
      toggleFieldError(field, true, msg2);
      return msg2;
    }

    // Email check
    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toggleFieldError(field, true, "Please enter a valid email address.");
      return "Invalid email";
    }

    toggleFieldError(field, false, "");
    return null;
  }

  function toggleFieldError(field, hasError, message) {
    var errorSpan = document.getElementById("error-" + field.name);
    if (!errorSpan) return;

    field.setAttribute("aria-invalid", hasError ? "true" : "false");

    if (hasError) {
      errorSpan.textContent = message;
      errorSpan.classList.remove("hidden");
      field.classList.add("border-red-600");
      field.classList.remove("border-gray-300");
    } else {
      errorSpan.textContent = "";
      errorSpan.classList.add("hidden");
      field.classList.remove("border-red-600");
      field.classList.add("border-gray-300");
    }
  }

  // Real-time validation on blur
  form.querySelectorAll("input, textarea, select").forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
  });

  // Submit to webhook
  function submitForm() {
    var formData = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    fetch(webhookUrl, {
      method: "POST",
      body: formData,
    })
      .then(function () {
        window.location.href = successRedirect;
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        var errorDiv = document.getElementById("form-error");
        if (errorDiv) errorDiv.classList.remove("hidden");
      });
  }
});
