# Backoffice FE Application

## Overview
This project is the front-end counterpart to the Backoffice BE Backend, designed for back-office operations with a focus on customer management and user authentication. Built with Angular and styled with TailwindCSS, it provides a robust and responsive user interface for managing customer records and user authentication.

## Features
- **User Authentication:** Allows users with access to log in.
- **Customer Management:**
  - Create new customer records.
  - View all customers with pagination support.
  - Search customers by name or number.
  - Apply advanced filters to search customers within a range of age or date of birth.
- **State Preservation:** All filters, pagination, and searches are encoded in the routing, preserving the user state even after the page refreshes.
- **Customer Update and Deletion:** Includes modals for confirming deletion and displaying old data versus new changes during updates.
