# FreshMarket
**Fresh Market** is a web application designed for managing the purchase of forest products for companies. 
The application supports two roles:
- **Admin** (company owner)
- **Client** (company’s client who sells products to the company)

To access the application, you need to register your company with the required information. After successful registration, you gain access to manage products, purchases, notifications, and add clients.

Once a client is successfully added with the necessary information, the client receives an email with login credentials to access the application (client role). Upon their first login, the client is required to change their password.

After successful login, the client role has access to view the products the company purchases, product prices, a list of their sold products (total earnings), and notifications.

The Dashboard page provides an overview of all relevant information for both admin and client roles (displayed with charts).

---

## Features
✅ Company registration and management  
✅ Product and purchase management  
✅ Client management with automatic email notifications  
✅ Real-time dashboard with charts  
✅ Role-based access (Admin / Client)  
✅ Password change on first login 

---

## Technologies Used
- **Backend:** ASP.NET Core Web API  
- **Frontend:** Angular  
- **Database:** SQL Server  
- **Authentication:** Keycloak  
- **Real-time:** SignalR  
- **Sending Email:** SendGrid

# Installation and Startup

### 1. Clone the repository:

```bash
git clone https://github.com/Nodi123Or/Fresh.git
```

### 2. Install Frontend Dependencies

Go to the Angular project folder and install all required packages:

```bash
npm install
```

### 3. Run Docker Containers

The project uses Docker Compose to run the backend services, database, and Keycloak.
Make sure you have Docker Desktop or Docker Engine installed, then run:

```bash
docker-compose up --build
```

# Credentials for accessing the application

### Admin Role
- **Username:** admin_company
- **Password:** admin1234

### Client Role
For the client role, you need to add a new client.
When entering the client’s email, use your own email address so you can receive the login credentials to access the application.