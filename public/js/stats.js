// Stats page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Copy button
  document.addEventListener("click", function (e) {
    console.log(e.target);
    if (e.target.classList.contains("btn-copy")) {
      const url = e.target.getAttribute("data-url");
      copyToClipboard(url);
    }
  });

  // Delete button
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
      const code = e.target.getAttribute("data-code");
      deleteLink(code, e.target);
    }
  });

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
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
      const response = await fetch(`/stats/${code}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.href = "/";
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
