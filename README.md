# Note:- Live Site Only Works On FireFox(Due to Cookie-related issues)

[iTasks](https://cheery-marzipan-f3d0db.netlify.app/)

# iTasks - Full-Stack Task Management Application

A comprehensive task management web application built with Spring Boot backend and React frontend, featuring JWT authentication, MySQL database(initially), and modern UI components.

## 📋 Overview

iTasks is a full-stack web application that allows users to manage their tasks efficiently. The application provides secure user authentication, task CRUD operations, filtering and searching capabilities, and a responsive user interface.

## Deployment

- **Note**: Might take some while to load as "Render" automaatically closes free servers on inactivity.
- **Backend**: [Docker](https://hub.docker.com/r/meowmeowrahul/itasks),Render
- **Frontend**: Netlify
- **Database**: Neon(Postgresql)

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by completion status, due dates, and custom labels
- **Search Functionality**: Search tasks by title, content, or labels
- **Priority System**: Set task priorities (Least, Medium, High, Highest)
- **Label System**: Add custom labels to organize tasks
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Secure Backend**: Spring Security with JWT token validation
- **RESTful API**: Well-structured REST endpoints for all operations
- **LogOut**: Deletes the sent cookie before exipartion

## 🎯 Usage Guide

### Getting Started

1. **Register a new account**:
   - Click on the registration form
   - Enter your username and password
   -  Submit the form
   - if "User Not Found" alert is not thrown, registartion is successful
   - You will be sent back to Login Form

2. **Login**:
   - Use your registered credentials
   - The system will authenticate you and store a secure JWT token

3. **Create your first task**:
   - Click the "Add Task" button
   - Fill in the task details:
     - **Header**: Task title
     - **Content**: Task description
     - **Priority**: Select from Least, Medium, High, Highest
     - **End Date**: Optional due date
     - **Labels**: Add custom labels for organization

4. **Manage tasks**:
   - **Mark as complete**: Click the checkbox
   - **Edit task**: Click the edit button
   - **Delete task**: Click the delete button
   - **Filter tasks**: Use the filter options in the navbar
   - **Search tasks**: Use the search bar to find specific tasks

5. **Logout**:
   - **Token Expired**: Token is valid for 1 hour after that Login again is required
   - **Manual Logout**: Clicking on Logout deletes the generated Token
  
## Few ScreenShots 

### Login Page

![Login](/img/login-page.png)

### Demo State 1

![ScreenShot1](/img/img1.png)

### Demo State 2

![ScreenShot2](/img/img2.png)

### Demo Mobile State

![mobile](/img/mobile-page.png)


## 🛠 Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0+**
- **JWT (JSON Web Tokens)**
- **Lombok**
- **BCrypt Password Encryption**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Axios**
- **React Context API**
- **React Hooks**

### Database
- **MySQL 8.0+**
- **Neon(Postgresql)**

### Database Schema

The application automatically creates the following tables:
- `users` - User accounts
- `task` - Task information
- `task_labels` - Task labels (many-to-many relationship)

## 📁 Project Structure

```
iTasks/
├── backend/
│   ├── src/main/java/com/meowmeowrahul/to_do/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── JwtFilter.java
│   │   ├── controller/
│   │   │   └── UserController.java
│   │   ├── model/
│   │   │   ├── Users.java
│   │   │   ├── Task.java
│   │   │   └── UserPrincipal.java
│   │   ├── repo/
│   │   │   ├── UserRepo.java
│   │   │   └── TaskRepo.java
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   ├── JwtService.java
│   │   │   └── MyUserDetailsService.java
│   │   └── ToDoApplication.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AddTask.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── Login.jsx
│   │   ├── context/
│   │   │   └── Context.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
### API Endpoints

The backend provides the following REST endpoints:

#### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /check-token` - Verify JWT token
- `GET /logout` - Logout

#### Task Management
- `GET /tasks` - Get all user tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `GET /tasks/search/{value}` - Search tasks
- `GET /tasks/filter/completed` - Filter completed tasks
- `GET /tasks/sort/today` - Get today's tasks

## 🛡️ Security Features

- **JWT Authentication** with HttpOnly cookies
- **Password encryption** using BCrypt
- **CSRF protection** disabled (using JWT)
- **CORS configuration** for cross-origin requests
- **Stateless session** management
- **Secure cookie handling**

**Date-19/09/2025,SECOND YEAR,SEM-3**
