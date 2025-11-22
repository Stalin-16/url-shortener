// Dashboard functionality
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createLinkForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const targetUrl = document.getElementById("targetUrl").value;
    const customCode = document.getElementById("customCode").value;

    // Clear previous errors and messages
    clearErrors();
    hideMessage();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating...";

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUrl,
          customCode: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Short link created successfully!", "success");
        form.reset();
        // Reload page to show new link
        setTimeout(() => location.reload(), 1500);
      } else {
        if (response.status === 409) {
          showError(
            "codeError",
            "This custom code is already taken. Please choose another one."
          );
        } else if (data.errors) {
          data.errors.forEach((error) => {
            if (error.path === "targetUrl") {
              showError("urlError", error.msg);
            } else if (error.path === "customCode") {
              showError("codeError", error.msg);
            }
          });
        } else {
          showMessage(data.error || "Failed to create short link", "error");
        }
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Short Link";
    }
  });

  // Copy buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-copy")) {
      const url = e.target.getAttribute("data-url");
      copyToClipboard(url);
    }
  });

  // Delete buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
      const code = e.target.getAttribute("data-code");
      deleteLink(code, e.target);
    }
  });

  // Form validation
  function validateForm() {
    let isValid = true;
    const targetUrl = document.getElementById("targetUrl").value;
    const customCode = document.getElementById("customCode").value;

    // Validate URL
    if (!targetUrl) {
      showError("urlError", "Please enter a URL");
      isValid = false;
    } else if (!isValidUrl(targetUrl)) {
      showError(
        "urlError",
        "Please enter a valid URL with http:// or https://"
      );
      isValid = false;
    }

    // Validate custom code
    if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      showError(
        "codeError",
        "Custom code must be 6-8 characters and contain only letters and numbers"
      );
      isValid = false;
    }

    return isValid;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach((error) => {
      error.textContent = "";
      error.classList.remove("show");
    });
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `message ${type}`;
    formMessage.style.display = "block";
  }

  function hideMessage() {
    formMessage.style.display = "none";
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      // Visual feedback could be added here
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  async function deleteLink(code, button) {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    button.disabled = true;
    button.textContent = "Deleting...";

    try {
      const response = await fetch(`/${code}`, {
        method: "DELETE",
      });

      if (response.ok) {
        location.reload();
      } else {
        alert("Failed to delete link");
        button.disabled = false;
        button.textContent = "Delete";
      }
    } catch (error) {
      alert("Network error. Please try again.");
      button.disabled = false;
      button.textContent = "Delete";
    }
  }
});
