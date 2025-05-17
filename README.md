# Simple Client-Side CRM

A lightweight, browser-based CRM (Customer Relationship Management) application to manage client information. This project is built entirely with HTML, CSS, and vanilla JavaScript, utilizing `localStorage` for data persistence.

## Description

This application allows users to add, view, edit, delete, search, and sort client records. It's designed to be a simple tool for individuals or small teams who need a basic way to keep track of client interactions and details without requiring a backend server or database. All data is stored locally in the user's browser.

## Features

*   **Add Clients:** Easily add new clients with details such as name, email, phone number, status (e.g., active, lead, inactive), and notes.
*   **View Clients:** Display a list of all clients with their key information.
*   **Edit Clients:** Modify existing client details through a modal form.
*   **Delete Clients:** Remove clients from the list with a confirmation step.
*   **Client Count:** Shows the total number of clients.
*   **Input Validation:** Real-time validation for name, email, and phone number fields to ensure data integrity.
*   **Search/Filter:** Dynamically filter the client list based on search terms matching name, email, phone, or notes.
*   **Sort Clients:** Sort the client list by name (alphabetically) or by the date they were added (newest first).
*   **Data Persistence:** Client data is saved in the browser's `localStorage`, so information isn't lost when the browser is closed and reopened.
*   **Export to CSV:** Export the current list of clients to a CSV file for backup or use in other applications.
*   **User Notifications:** Provides feedback to the user for actions like adding, updating, deleting, or exporting clients.
*   **Responsive (Basic):** The layout should adapt to different screen sizes (assuming basic CSS is in place).

## How to Use

1.  **Clone or Download:** Get the project files onto your local machine.
2.  **Open `index.html`:** Simply open the `index.html` file (or whatever your main HTML file is named) in your web browser.
3.  **Start Managing Clients:**
    *   Use the form to add new clients.
    *   Use the search bar to find specific clients.
    *   Use the sort dropdown to organize the list.
    *   Click "Edit" or "Delete" on a client's entry to manage them.
    *   Click "Export Clients" to download a CSV file of your client data.

## Technologies Used

*   **HTML5:** For the structure of the web page.
*   **CSS3:** (Assumed) For styling the application.
*   **Vanilla JavaScript (ES6+):** For all the application logic, DOM manipulation, event handling, and `localStorage` interaction.

## Project Structure (Assumed)
