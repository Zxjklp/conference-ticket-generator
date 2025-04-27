document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("ticket-form");
  const formSection = document.getElementById("form-section");
  const ticketSection = document.getElementById("ticket-section");
  const uploadArea = document.getElementById("upload-area");
  let fileInput = document.getElementById("avatar");

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
        // Clear the upload area
        uploadArea.innerHTML = "";

        // Create and add the image preview
        const imgPreview = document.createElement("img");
        imgPreview.src = e.target.result;
        imgPreview.className = "avatar-preview";
        imgPreview.alt = "Avatar Preview";
        uploadArea.appendChild(imgPreview);

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "avatar-buttons";

        // Create Remove button
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn-remove";
        removeBtn.textContent = "Remove image";
        removeBtn.addEventListener("click", removeImage);

        // Create Change button
        const changeBtn = document.createElement("button");
        changeBtn.type = "button";
        changeBtn.className = "btn-change";
        changeBtn.textContent = "Change image";
        changeBtn.addEventListener("click", changeImage);

        // Add buttons to container
        buttonContainer.appendChild(removeBtn);
        buttonContainer.appendChild(changeBtn);

        // Add button container to upload area
        uploadArea.appendChild(buttonContainer);

        // Make sure error is cleared
        clearError(fileInput);
      };
      reader.readAsDataURL(file);
      return true;
    }
    return false;
  }

  // Function to restore the original upload area
  function restoreUploadArea() {
    uploadArea.innerHTML = `
      <img src="./assets/images/icon-upload.svg" alt="" class="upload-icon">
      <p>Drag and drop or click to upload</p>
      <input type="file" id="avatar" name="avatar" accept="image/jpeg, image/png" class="file-input">
    `;

    // Re-assign the file input variable since we've replaced the DOM element
    fileInput = document.getElementById("avatar");

    // Re-attach event listeners
    fileInput.addEventListener("change", validateFileUpload);

    // Re-attach drag and drop handlers
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener("drop", handleDrop, false);
  }

  // Function to remove the uploaded image
  function removeImage() {
    // Clear the file input value
    fileInput.value = "";

    // Restore original upload area
    restoreUploadArea();
  }

  // Function to trigger the file input click
  function changeImage() {
    fileInput.click();
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
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";

    // Create icon element
    const iconSpan = document.createElement("span");
    iconSpan.className = "error-icon";

    // Add text span
    const textSpan = document.createElement("span");
    textSpan.textContent = message;

    // Append elements to error message
    errorMessage.appendChild(iconSpan);
    errorMessage.appendChild(textSpan);

    formField.appendChild(errorMessage);

    // Hide the form hint if this is an avatar upload error
    if (inputElement.id === "avatar") {
      const formHint = formField.querySelector(".form-hint");
      if (formHint) {
        formHint.style.display = "none";
      }
    }

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

    // Show the form hint again if this was an avatar upload field
    if (inputElement.id === "avatar") {
      const formHint = formField.querySelector(".form-hint");
      if (formHint) {
        formHint.style.display = "";
      }
    }
  }

  function generateTicket(name, email, github, avatarFile) {
    // Update ticket information
    ticketName.textContent = name + "!";
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
