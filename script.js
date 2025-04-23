document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("ticket-form");
  const formSection = document.getElementById("form-section");
  const ticketSection = document.getElementById("ticket-section");
  const uploadArea = document.getElementById("upload-area");
  const fileInput = document.getElementById("avatar");

  // Ticket info elements
  const ticketName = document.getElementById("ticket-name");
  const ticketEmail = document.getElementById("ticket-email");
  const displayName = document.getElementById("display-name");
  const displayGithub = document.getElementById("display-github");
  const ticketAvatar = document.getElementById("ticket-avatar-img");

  // Handle drag and drop for avatar upload
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    uploadArea.classList.add("highlight");
  }

  function unhighlight() {
    uploadArea.classList.remove("highlight");
  }

  uploadArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileInput.files = files;
    validateFileUpload();
  }

  // Validate file upload
  fileInput.addEventListener("change", validateFileUpload);

  function validateFileUpload() {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Check file type
      const fileType = file.type;
      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        showError(fileInput, "Please upload a JPG or PNG file.");
        return false;
      }

      // Check file size (500KB max)
      const fileSize = file.size / 1024; // Convert to KB
      if (fileSize > 500) {
        showError(fileInput, "File size exceeds 500KB limit.");
        return false;
      }

      // If valid, show preview
      const reader = new FileReader();
      reader.onload = function (e) {
        // You could add a preview here if needed
        clearError(fileInput);
      };
      reader.readAsDataURL(file);
      return true;
    }
    return false;
  }

  // Form validation
  form.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const github = document.getElementById("github").value.trim();

    // Validate form fields
    let isValid = true;

    if (!fullName) {
      showError(
        document.getElementById("full-name"),
        "Please enter your full name."
      );
      isValid = false;
    } else {
      clearError(document.getElementById("full-name"));
    }

    if (!email) {
      showError(
        document.getElementById("email"),
        "Please enter your email address."
      );
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(
        document.getElementById("email"),
        "Please enter a valid email address."
      );
      isValid = false;
    } else {
      clearError(document.getElementById("email"));
    }

    if (!github) {
      showError(
        document.getElementById("github"),
        "Please enter your GitHub username."
      );
      isValid = false;
    } else {
      clearError(document.getElementById("github"));
    }

    // Check if avatar was uploaded
    if (!fileInput.files || !fileInput.files[0]) {
      showError(fileInput, "Please upload an avatar.");
      isValid = false;
    } else {
      isValid = validateFileUpload() && isValid;
    }

    // If form is valid, generate ticket
    if (isValid) {
      generateTicket(fullName, email, github, fileInput.files[0]);
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(inputElement, message) {
    const formField = inputElement.closest(".form-field");
    formField.classList.add("error");

    // Remove any existing error message
    const existingError = formField.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and append error message
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    formField.appendChild(errorMessage);

    // Ensure the error is announced to screen readers
    errorMessage.setAttribute("role", "alert");
  }

  function clearError(inputElement) {
    const formField = inputElement.closest(".form-field");
    formField.classList.remove("error");

    const errorMessage = formField.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function generateTicket(name, email, github, avatarFile) {
    // Update ticket information
    ticketName.textContent = name;
    ticketEmail.textContent = email;
    displayName.textContent = name;
    displayGithub.textContent = github;

    // Set avatar image
    const reader = new FileReader();
    reader.onload = function (e) {
      ticketAvatar.src = e.target.result;
    };
    reader.readAsDataURL(avatarFile);

    // Show ticket section, hide form section
    formSection.style.display = "none";
    ticketSection.classList.remove("hidden");
  }
});
