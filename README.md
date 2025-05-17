# 🌟 Simple Client-Side CRM 🌟

A lightweight, browser-based CRM (Customer Relationship Management) application to manage client information. This project is built entirely with HTML, CSS, and vanilla JavaScript, utilizing `localStorage` for data persistence.

## 📝 Description

This application allows users to add, view, edit, delete, search, and sort client records. It's designed to be a simple tool for individuals or small teams who need a basic way to keep track of client interactions and details without requiring a backend server or database. All data is stored locally in the user's browser.

You can add more plain text here to describe your project in greater detail, perhaps discussing your motivations for building it or specific use cases you envisioned.

## ✨ Features

*   ➕ **Add Clients:** Easily add new clients with details such as name, email, phone number, status (e.g., active, lead, inactive), and notes.
*   👀 **View Clients:** Display a list of all clients with their key information.
*   ✏️ **Edit Clients:** Modify existing client details through a modal form.
*   🗑️ **Delete Clients:** Remove clients from the list with a confirmation step.
*   📊 **Client Count:** Shows the total number of clients.
*   ✔️ **Input Validation:** Real-time validation for name, email, and phone number fields to ensure data integrity.
*   🔒 **Security (XSS Prevention):** User-provided input (like client names and notes) is sanitized using HTML escaping to prevent Cross-Site Scripting (XSS) vulnerabilities.
*   🔍 **Search/Filter:** Dynamically filter the client list based on search terms matching name, email, phone, or notes.
*   ⇅ **Sort Clients:** Sort the client list by name (alphabetically) or by the date they were added (newest first).
*   💾 **Data Persistence:** Client data is saved in the browser's `localStorage`, so information isn't lost when the browser is closed and reopened.
*   📄 **Export to CSV:** Export the current list of clients to a CSV file for backup or use in other applications.
*   🔔 **User Notifications:** Provides feedback to the user for actions like adding, updating, deleting, or exporting clients.
*   📱 **Responsive (Basic):** The layout should adapt to different screen sizes.

## 🚀 How to Use

1.  **Clone or Download:** Get the project files onto your local machine.
    ```bash
    git clone https://github.com/Edmonas2011/simple-js-crm.git
    ```
2.  **Navigate to Project Directory:**
    ```bash
    cd simple-js-crm
    ```
3.  **Open `index.html`:** Simply open the `index.html` file in your web browser.
4.  **Start Managing Clients:**
    *   Use the form to add new clients.
    *   Use the search bar to find specific clients.
    *   Use the sort dropdown to organize the list.
    *   Click "Edit" or "Delete" on a client's entry to manage them.
    *   Click "Export Clients" to download a CSV file of your client data.

## 🛠️ Technologies Used

*   **HTML5:** For the structure of the web page.
*   **CSS3:** For styling the application.
*   **🍦 Vanilla JavaScript (ES6+):** For all the application logic, DOM manipulation, event handling, and `localStorage` interaction.
*   **Font Awesome:** For icons.

## 📂 Project Structure

```
/simple-js-crm
|-- index.html       (Main HTML file)
|-- styles/
|   |-- styles.css   (Main CSS file)
|-- js/
|   |-- script.js    (Main JavaScript file)
|-- README.md        (This file)
|-- LICENSE          (e.g., MIT License file)
```

## 💡 Future Enhancements (Ideas)

*   More advanced filtering options (e.g., by status).
*   Customizable fields for client data.
*   Import clients from CSV.
*   Pagination for large lists of clients.
*   More sophisticated UI/UX improvements.
*   🌙 Dark mode.
*   Unit/Integration tests.

## 📬 Connect with Me

Feel free to reach out if you have any questions or suggestions!

*   **GitHub:** Edmonas2011
*   **Telegram:** edmonaseyann
*   **Instagram:** 111_.ase7aann

---

You can add more plain text sections here as well. For example, a "Contributing" section if you want others to contribute, or a "License" section (though it's common to have a separate `LICENSE` file for the full license text).

Feel free to contribute to this project by submitting issues or pull requests!
