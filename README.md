# 🎟️ Ticket Booking System

A full-stack ticket booking platform for movies and live events, built with **Java, Spring Boot, React, and MySQL**.

## ✨ Highlights

- 🔐 JWT-based authentication and authorization
- 🎬 Browse movies and live events
- 💺 Interactive seat selection
- 🎫 Multi-seat booking and booking history
- 💳 Payment processing simulation
- ❌ Booking cancellation
- 📱 Digital tickets with QR codes
- 🛡️ Admin dashboard for events, venues, shows, and bookings
- 🌐 REST APIs connecting React with Spring Boot

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate |
| Authentication | JWT |
| Frontend | React, JavaScript, React Router, Axios, Vite |
| Database | MySQL |
| Build Tool | Maven |
| API Style | REST |

## 🏗️ Architecture

```text
React Frontend
      │ REST API / JSON
      ▼
Spring Boot Backend
      │
      ├── Spring Security + JWT
      ├── REST Controllers
      ├── Service Layer
      └── Spring Data JPA
              │
              ▼
            MySQL
```

## 📁 Project Structure

```text
ticket-booking-system/
├── backend/       # Spring Boot application
├── frontend/      # React application
└── README.md
```

## 🚀 Getting Started

```bash
git clone https://github.com/anubhavsahu1232-cmd/ticket-booking-system.git
cd ticket-booking-system
```

Configure your MySQL connection and required environment variables, then:

```bash
cd backend
mvn spring-boot:run
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

> Never commit database passwords, JWT secrets, API keys, or other credentials.

## 🌐 Live Demo

**Frontend:** https://ticket-booking-system-vercel-8z51dzxkd-single-159e.vercel.app/

> The deployed application may depend on the availability of its backend and database services.

## 📌 What I Learned

- REST API development with Spring Boot
- JWT authentication and protected routes
- React-to-backend API integration
- JPA/Hibernate with MySQL
- Booking and seat-selection workflows
- Admin workflows
- Full-stack deployment

## 🔮 Future Improvements

- Real payment gateway integration
- Email booking notifications
- Advanced search and filtering
- Automated testing and CI/CD
- Production monitoring

## 👨‍💻 Author

**Anubhav Sahu**  
MCA Student | Java | Spring Boot | React | MySQL

## 📄 License

Educational and portfolio project.
