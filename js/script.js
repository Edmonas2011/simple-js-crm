// Waits for the HTML document to be fully loaded and parsed before running the script.
document.addEventListener('DOMContentLoaded', function() {
  // Get references to DOM elements for client list display and count.
  const clientsList = document.getElementById('clientsList');
  const emptyList = document.getElementById('emptyList');
  const clientCount = document.getElementById('clientCount');

  // Get references to main action buttons and input fields.
  const addClientBtn = document.getElementById('addClientBtn');
  const clearFormBtn = document.getElementById('clearFormBtn');
  const exportBtn = document.getElementById('exportBtn');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  
  // Get references to input fields in the "Add Client" form.
  const nameInput = document.getElementById('clientName');
  const emailInput = document.getElementById('clientEmail');
  const phoneInput = document.getElementById('clientPhone');
  const notesInput = document.getElementById('clientNotes');
  const statusSelect = document.getElementById('clientStatus');
  
  // Get references to error message display elements for the "Add Client" form.
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  
  // Get references to elements of the modal dialog for editing clients.
  const modal = document.getElementById('clientModal');
  const closeModal = document.querySelector('.close-modal');
  const editNameInput = document.getElementById('editClientName');
  const editEmailInput = document.getElementById('editClientEmail');
  const editPhoneInput = document.getElementById('editClientPhone');
  const editNotesInput = document.getElementById('editClientNotes');
  const editStatusSelect = document.getElementById('editClientStatus');
  const saveClientBtn = document.getElementById('saveClientBtn');
  
  // Application state variables:
  // `clients` array holds all client objects. It's loaded from localStorage or initialized as empty.
  let clients = loadClientsFromStorage() || [];
  // `currentEditId` stores the ID of the client currently being edited in the modal. Null if no client is being edited.
  let currentEditId = null;
  
  //this function get all clients and shows it on page
  renderAllClients();
  updateClientCount();
  
  // Event Listeners for primary actions.
  addClientBtn.addEventListener('click', addClient);
  clearFormBtn.addEventListener('click', clearForm);
  exportBtn.addEventListener('click', exportClientData);
  
  //checks if name is correct
  nameInput.addEventListener('input', function() {
    if (this.value.trim() && isValidName(this.value.trim())) {
      nameError.style.display = 'none';
    }
  });
  
  //checks if email is correct
  emailInput.addEventListener('input', function() {
    if (this.value.trim() && isValidEmail(this.value.trim())) {
      emailError.style.display = 'none';
    }
  });
  
  //checks if phone is correct
  phoneInput.addEventListener('input', function() {
    if (this.value.trim() && isValidPhone(this.value.trim())) {
      phoneError.style.display = 'none';
    }
  });
  
  // Adds a keypress listener to the client form to allow submission with the Enter key.
  document.getElementById('clientForm').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addClient();
    }
  });
  
  // Event listener for filtering clients as the user types in the search input.
  searchInput.addEventListener('input', filterClients);
  // Event listener for sorting clients when the sort selection changes.
  sortSelect.addEventListener('change', sortClients);
  
  // Event listener for closing the modal via the close button (X).
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Event listener to close the modal if the user clicks outside of it.
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Event listener for saving the edited client data from the modal.
  saveClientBtn.addEventListener('click', saveEditedClient);
  
  /**
   * Updates the displayed count of clients and shows/hides the "empty list" message.
   */
  function updateClientCount() {
    const count = clients.length;
    // Display singular or plural "client" based on the count.
    clientCount.textContent = count === 1 ? '1 client' : `${count} clients`;
    
    // Show or hide the "empty list" message.
    if (count > 0) {
      emptyList.style.display = 'none';
    } else {
      emptyList.style.display = 'block';
    }
  }
  
  // very important function to dont get hacked for example this script didnt work
  // <script>alert('hacked!')</script>
  /**
   * Escapes HTML special characters in a string to prevent XSS (Cross-Site Scripting).
   * @param {string} str - The string to escape.
   * @returns {string} The escaped string.
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  
  // Validation functions
  /**
   * Validates a client's name.
   * Allows letters (English and Cyrillic), spaces, hyphens, and apostrophes. Length 2-50.
   * @param {string} name - The name to validate.
   * @returns {boolean} True if the name is valid, false otherwise.
   */
  function isValidName(name) {
    return /^[A-Za-zА-Яа-яёЁ\s'-]{2,50}$/.test(name);
  }
  
  /**
   * Validates an email address using a common regex pattern.
   * @param {string} email - The email to validate.
   * @returns {boolean} True if the email is valid, false otherwise.
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  /**
   * Validates a phone number.
   * Allows an optional '+' at the beginning, followed by 7 to 15 digits.
   * @param {string} phone - The phone number to validate.
   * @returns {boolean} True if the phone number is valid, false otherwise.
   */
  function isValidPhone(phone) {
    return /^\+?[0-9]{7,15}$/.test(phone);
  }
  
  /**
   * Gets an emoji representation for a client's status.
   * @param {string} status - The client's status ('active', 'lead', 'inactive').
   * @returns {string} An emoji corresponding to the status, or a default user icon.
   */
  function getStatusEmoji(status) {
    switch(status) {
      case 'active': return '🟢';
      default: return '👤';
    }
  }
  
  /**
   * Gets a CSS class name for a client's status for styling.
   * @param {string} status - The client's status.
   * @returns {string} A CSS class name (e.g., 'status-active') or an empty string for default.
   */
  function getStatusClass(status) {
    switch(status) {
      case 'active': return 'status-active';
      case 'lead': return 'status-lead';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  }
  
  // client added data
  /**
   * Formats a date object or date string into a more readable format (e.g., "Oct 26, 2023, 03:45 PM").
   * @param {Date|string} date - The date to format.
   * @returns {string} The formatted date string.
   */
  function formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  // gets values from formes (name,email,phone,notes,status)
  // removes extra spaces from edges (trim())
  // hides all messages with errors
  // checks each filled using function isValidName,isValidEmail,isValidPhone
  // if any filled incorrectly shows the message about error and stops fuction execution (return)
  // if all data is correct:
  //    creates unique id for every new client using (Date.now())
  //    creates oject clientData with all information about client including data add
  //    calls saveClientsToStorage(), to save updated list in browsers memory
  //    calls renderClient(clientData), to show new client on page
  //    calls updateClientCount() to update counter
  //    calls clearForm(), to clean form inputs
  //    calls sortClients() for list to be unsorted
  function addClient() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const notes = notesInput.value.trim();
    const status = statusSelect.value;
    
    // Hide previous error messages
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    phoneError.style.display = 'none';
    
    // Flag to track overall form validity
    let isValid = true;
    
    if (!name || !isValidName(name)) {
      nameError.style.display = 'block';
      isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
      emailError.style.display = 'block';
      isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
      phoneError.style.display = 'block';
      isValid = false;
    }
    
    // If any validation fails, stop processing
    if (!isValid) {
      return;
    }
    
    // Create client data object
    const clientId = Date.now().toString();
    const clientData = {
      id: clientId,
      name: name,
      email: email,
      phone: phone,
      notes: notes,
      status: status,
      dateAdded: new Date()
    };
    
    // Add new client and update storage/UI
    clients.push(clientData);
    saveClientsToStorage();
    renderClient(clientData);
    
    updateClientCount();
    clearForm();
    sortClients(); // Re-sort the list after adding a new client
    
    // Show success notification
    showNotification('Client added successfully!', 'success');
  }
  
  /**
   * Renders a single client item and appends it to the client list in the DOM.
   * @param {object} clientData - The client object containing its details.
   */
  function renderClient(clientData) {
    const li = document.createElement('li');
    li.className = `client-item ${clientData.status}-client`;
    // Store client ID in a data attribute for easy access later (e.g., for delete/edit)
    li.dataset.id = clientData.id;
    
    const statusEmoji = getStatusEmoji(clientData.status);
    const statusClass = getStatusClass(clientData.status);
    
    let notesHTML = '';
    // Only add notes HTML if notes exist, and escape HTML to prevent XSS.
    if (clientData.notes) {
      notesHTML = `<div class="client-notes">📝 ${escapeHTML(clientData.notes)}</div>`;
    }
    
    li.innerHTML = `
      <div class="client-info">
        <div class="client-name">
          <!-- Display status emoji, client name (escaped), and status badge -->
          ${statusEmoji} ${escapeHTML(clientData.name)}
          <span class="status-badge ${statusClass}">${clientData.status}</span>
        </div>
        <div class="client-email">📧 ${escapeHTML(clientData.email)}</div>
        <div class="client-phone">📞 ${escapeHTML(clientData.phone)}</div>
        ${notesHTML}
        <div class="client-date">Added: ${formatDate(clientData.dateAdded)}</div>
      </div>
      <div class="client-actions">
        <!-- Action buttons for editing and deleting the client -->
        <button class="btn btn-edit edit-btn" data-id="${clientData.id}">Edit</button>
        <button class="btn btn-danger delete-btn" data-id="${clientData.id}">Delete</button>
      </div>
    `;
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
      // `this.dataset.id` refers to the data-id attribute of the clicked delete button.
      deleteClient(this.dataset.id);
    });
    
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
      // `this.dataset.id` refers to the data-id attribute of the clicked edit button.
      openEditModal(this.dataset.id);
    });
    
    clientsList.appendChild(li);
    
    // Simple fade-in animation for newly added client items.
    li.style.opacity = '0';
    setTimeout(() => {
      li.style.transition = 'opacity 0.5s';
      li.style.opacity = '1';
    }, 10); // Small delay to ensure CSS transition applies.
  }
  
  /**
   * Deletes a client after confirmation.
   * @param {string} clientId - The ID of the client to delete.
   */
  function deleteClient(clientId) {
    // Find the list item element corresponding to the client ID.
    const li = document.querySelector(`.client-item[data-id="${clientId}"]`);
    
    // Ask for user confirmation before deleting.
    if (confirm('Are you sure you want to delete this client?')) {
      // Apply animation for removal.
      li.style.transition = 'opacity 0.3s, transform 0.3s';
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        li.remove();
        // Update the clients array by filtering out the deleted client.
        clients = clients.filter(client => client.id !== clientId);
        saveClientsToStorage();
        updateClientCount();
        showNotification('Client deleted successfully!', 'danger');
      }, 300);
    }
  }
  
  /**
   * Clears all input fields in the "Add Client" form and resets error messages.
   */
  function clearForm() {
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    notesInput.value = '';
    statusSelect.value = 'active';
    
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    phoneError.style.display = 'none';
    
    // Set focus to the name input for convenience.
    nameInput.focus();
  }
  
  /**
   * Filters the displayed client list based on the text entered in the search input.
   * The search is case-insensitive and checks name, email, phone, and notes.
   */
  function filterClients() {
    const searchTerm = searchInput.value.toLowerCase();
    const clientItems = document.querySelectorAll('.client-item');
    
    clientItems.forEach(item => {
      const clientId = item.dataset.id;
      // Find the client object from the `clients` array.
      const client = clients.find(c => c.id === clientId);
      
      if (!client) return; // Should not happen if data is consistent, but good for safety.
      // Check if search term matches any of the client's fields.
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm) ||
        (client.notes && client.notes.toLowerCase().includes(searchTerm));
      
      if (matchesSearch) {
        // Show the item if it matches.
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  /**
   * Sorts the `clients` array based on the selected criteria (name or date added) and redraws the list.
   */
  function sortClients() {
    const sortBy = sortSelect.value;
    
    clients.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        // Default sort is by dateAdded, newest first.
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });
    
    // Redraw the list with the new sort order.
    redrawClientsList();
  }
  
  /**
   * Clears the current client list in the DOM and re-renders all clients from the `clients` array.
   * Also re-applies the current search filter.
   */
  function redrawClientsList() {
    clientsList.innerHTML = '';
    clients.forEach(client => renderClient(client));
    filterClients(); // Ensure filtering is applied after redrawing.
  }
  
  /**
   * Opens the edit modal and populates its fields with the data of the specified client.
   * @param {string} clientId - The ID of the client to edit.
   */
  function openEditModal(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    currentEditId = clientId; // Store the ID of the client being edited.
    
    editNameInput.value = client.name;
    editEmailInput.value = client.email;
    editPhoneInput.value = client.phone;
    editNotesInput.value = client.notes || '';
    editStatusSelect.value = client.status;
    
    // Clear any previous error messages in the modal.
    document.getElementById('editNameError').style.display = 'none';
    document.getElementById('editEmailError').style.display = 'none';
    document.getElementById('editPhoneError').style.display = 'none';
    
    modal.style.display = 'block';
  }
  
  /**
   * Saves the changes made to a client in the edit modal.
   * Validates the input before saving.
   */
  function saveEditedClient() {
    if (!currentEditId) return;
    
    // Get updated values from modal form fields.
    const name = editNameInput.value.trim();
    const email = editEmailInput.value.trim();
    const phone = editPhoneInput.value.trim();
    const notes = editNotesInput.value.trim();
    const status = editStatusSelect.value;
    
    // Hide previous modal error messages.
    document.getElementById('editNameError').style.display = 'none';
    document.getElementById('editEmailError').style.display = 'none';
    document.getElementById('editPhoneError').style.display = 'none';
    
    let isValid = true;
    
    if (!name || !isValidName(name)) {
      // Show error message for invalid name.
      document.getElementById('editNameError').style.display = 'block';
      isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
      document.getElementById('editEmailError').style.display = 'block';
      isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
      document.getElementById('editPhoneError').style.display = 'block';
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    const clientIndex = clients.findIndex(c => c.id === currentEditId);
    if (clientIndex !== -1) {
      // Update client data in the array.
      clients[clientIndex].name = name;
      clients[clientIndex].email = email;
      clients[clientIndex].phone = phone;
      clients[clientIndex].notes = notes;
      clients[clientIndex].status = status;
      
      saveClientsToStorage();
      redrawClientsList();
      
      modal.style.display = 'none';
      showNotification('Client updated successfully!', 'success');
    }
  }
  
  /**
   * Exports the current client data to a CSV file and initiates a download.
   * The CSV file includes a header row and data for each client.
   */
  function exportClientData() {
    if (clients.length === 0) {
      alert('No clients to export');
      return;
    }
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    // CSV Header row.
    csvContent += 'Name,Email,Phone,Status,Notes,Date Added\n';
    
    clients.forEach(client => {
      const dateStr = formatDate(client.dateAdded);
      // Escape double quotes within fields by replacing them with two double quotes, as per CSV standard.
      const name = client.name.replace(/"/g, '""');
      const email = client.email.replace(/"/g, '""');
      const notes = client.notes ? client.notes.replace(/"/g, '""') : '';
      csvContent += `"${name}","${email}","${client.phone}","${client.status}","${notes}","${dateStr}"\n`;
    });
    // Create a temporary link to trigger the download.
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    link.click();
    // Clean up by removing the temporary link.
    document.body.removeChild(link);
    
    showNotification('Client data exported successfully!', 'success');
  }
  
  /**
   * Saves the `clients` array to the browser's local storage as a JSON string.
   */
  function saveClientsToStorage() {
    const clientsData = JSON.stringify(clients);
    localStorage.setItem('crm_clients', clientsData);
  }
  
  /**
   * Loads client data from local storage.
   * @returns {Array|null} The array of clients if found and parsed successfully, otherwise null.
   */
  function loadClientsFromStorage() {
    const clientsData = localStorage.getItem('crm_clients');
    if (!clientsData) return null;
    
    // Try to parse the JSON data; return null if there's an error (e.g., corrupted data).
    try {
      return JSON.parse(clientsData);
    } catch (e) {
      console.error('Error parsing client data from local storage:', e);
      return null;
    }
  }
  
  /**
   * Renders all clients from the `clients` array.
   * Typically used on initial page load.
   */
  function renderAllClients() {
    clientsList.innerHTML = '';
    clients.forEach(client => renderClient(client));
  }
  
  /**
   * Displays a temporary notification message on the screen.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification ('success', 'danger', etc.), used for styling.
   */
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger fade-in animation.
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Automatically remove the notification after a few seconds.
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Global event listener to close the modal when the 'Escape' key is pressed.
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
    }
  });
});