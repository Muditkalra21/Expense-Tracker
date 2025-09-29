# Enterprise Expense Tracker

A comprehensive Spring Boot application for tracking and managing company expenses with multi-company support, role-based access control, and JWT authentication.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Web Interface](#web-interface)
- [Authentication & Security](#authentication--security)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication & Authorization**: JWT-based authentication with secure login/registration
- **Multi-Company Support**: Users can be associated with multiple companies with different roles
- **Role-Based Access Control**: Owner and Member roles with different permissions
- **Expense Management**: Create, view, approve, and track expenses
- **Expense Approval Workflow**: Pending, Approved, and Rejected status management
- **RESTful API**: Complete REST API for all operations
- **Web Interface**: Modern, responsive web interface
- **Database Migration**: Flyway-based database versioning and migration
- **Security**: Spring Security with JWT tokens and password encryption

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **Spring Web** - REST API development
- **Oracle Database** - Primary database
- **Flyway** - Database migration
- **JWT (JSON Web Token)** - Authentication mechanism
- **Maven** - Dependency management and build tool

### Frontend
- **HTML5/CSS3**
- **Vanilla JavaScript**
- **Responsive Design**

## Project Structure

```
expense-tracker/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/expensetracker/
│   │   │       ├── ExpenseTrackerApplication.java    # Main application class
│   │   │       ├── config/                           # Configuration classes
│   │   │       │   ├── JwtAuthenticationFilter.java  # JWT filter
│   │   │       │   └── SecurityConfig.java           # Security configuration
│   │   │       ├── controller/                       # REST controllers
│   │   │       │   ├── AuthController.java           # Authentication endpoints
│   │   │       │   ├── CompanyController.java        # Company management
│   │   │       │   └── ExpenseController.java        # Expense operations
│   │   │       ├── dto/                              # Data Transfer Objects
│   │   │       │   ├── AuthRequest.java
│   │   │       │   ├── AuthResponse.java
│   │   │       │   ├── CompanyDto.java
│   │   │       │   ├── ExpenseDto.java
│   │   │       │   ├── UserCompanyDto.java
│   │   │       │   └── UserDto.java
│   │   │       ├── entity/                          # JPA entities
│   │   │       │   ├── Company.java
│   │   │       │   ├── Expense.java
│   │   │       │   ├── User.java
│   │   │       │   └── UserCompany.java
│   │   │       ├── exception/                       # Exception handling
│   │   │       │   └── GlobalExceptionHandler.java
│   │   │       ├── repository/                      # Data access layer
│   │   │       ├── service/                         # Business logic
│   │   │       └── util/                           # Utility classes
│   │   └── resources/
│   │       ├── application.yml                      # Application configuration
│   │       ├── db/migration/                        # Database migrations
│   │       │   └── V1__Create_tables.sql
│   │       └── static/                             # Web assets
│   │           ├── index.html                       # Main web page
│   │           ├── app.js                          # Frontend JavaScript
│   │           └── styles.css                       # Styling
│   └── test/                                        # Test classes
├── target/                                          # Build output
├── pom.xml                                          # Maven configuration
└── README.md                                        # This file
```

## Prerequisites

- **Java Development Kit (JDK) 17** or later
- **Apache Maven 3.6+**
- **Oracle Database 11g** or later (or Oracle XE)
- **Git** (for cloning the repository)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install Dependencies**
   ```bash
   mvn clean install
   ```

## Database Setup

### Oracle Database Configuration

1. **Install Oracle Database** (or Oracle XE for development)

2. **Create Database User**
   ```sql
   -- Connect as SYSTEM or DBA
   CREATE USER expense_user IDENTIFIED BY secret;
   GRANT CONNECT, RESOURCE TO expense_user;
   GRANT CREATE SESSION TO expense_user;
   GRANT CREATE TABLE TO expense_user;
   GRANT CREATE SEQUENCE TO expense_user;
   ```

3. **Database Migration**
   The application uses Flyway for database migration. Tables will be created automatically on startup.

### Database Schema

The application creates the following tables:

- **users**: User account information
- **companies**: Company details
- **user_companies**: Many-to-many relationship between users and companies with roles
- **expenses**: Expense records with approval workflow

## Configuration

### Application Configuration (`application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:xe
    username: expense_user
    password: secret
    driver-class-name: oracle.jdbc.OracleDriver
  jpa:
    hibernate:
      ddl-auto: validate
    database-platform: org.hibernate.dialect.Oracle12cDialect
    show-sql: true
  flyway:
    enabled: true

jwt:
  secret: mySecretKey
  expiration: 86400000  # 24 hours in milliseconds
```

### Environment Variables

You can override configuration using environment variables:
- `DB_URL`: Database URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRATION`: JWT token expiration time

## Running the Application

### Development Mode

```bash
mvn spring-boot:run
```

### Production Mode

1. **Build the JAR**
   ```bash
   mvn clean package
   ```

2. **Run the JAR**
   ```bash
   java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |

### Company Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/companies` | Create a new company |
| GET | `/api/companies` | Get user's companies |
| GET | `/api/companies/{id}` | Get company details |
| POST | `/api/companies/{companyId}/members` | Add member to company |

### Expense Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create a new expense |
| GET | `/api/expenses` | Get user's expenses |
| GET | `/api/expenses/{id}` | Get expense details |
| PUT | `/api/expenses/{id}/approve` | Approve an expense |
| PUT | `/api/expenses/{id}/reject` | Reject an expense |

### Request/Response Examples

**Registration Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login Request:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

**Create Expense Request:**
```json
{
  "companyId": 1,
  "amount": 150.00,
  "description": "Business lunch",
  "category": "Meals",
  "date": "2024-01-15"
}
```

## Web Interface

The application includes a responsive web interface accessible at `http://localhost:8080`

### Features:
- **User Registration/Login**: Secure authentication
- **Dashboard**: Overview of expenses and companies
- **Company Management**: Create and manage companies
- **Expense Tracking**: Submit and track expense requests
- **Approval Workflow**: Approve/reject expenses (for company owners)

## Authentication & Security

### JWT Authentication
- JWT tokens are used for stateless authentication
- Tokens expire after 24 hours (configurable)
- Secure password hashing using BCrypt

### Security Features
- CORS configuration for web interface
- SQL injection protection via JPA/Hibernate
- XSS protection through proper input validation
- Role-based access control

### User Roles
- **Company Owner**: Can approve/reject expenses, manage company members
- **Company Member**: Can submit expenses, view own expenses

## Database Schema

### Entity Relationships

```
Users (1) ←→ (N) UserCompanies (N) ←→ (1) Companies
Users (1) ←→ (N) Expenses (N) ←→ (1) Companies
Users (1) ←→ (N) Expenses (as approver)
```

### Key Constraints
- Unique username and email per user
- Users can have different roles in different companies
- Expenses have approval workflow (PENDING → APPROVED/REJECTED)
- Foreign key relationships ensure data integrity

## Development

### Building
```bash
mvn clean compile
```

### Running Tests
```bash
mvn test
```

### Code Style
The project follows standard Java conventions and Spring Boot best practices.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Oracle database is running
   - Check connection parameters in `application.yml`
   - Ensure user has proper permissions

2. **JWT Token Issues**
   - Check JWT secret configuration
   - Verify token expiration settings

3. **Port Conflicts**
   - Default port is 8080
   - Change port in `application.yml` if needed

### Logs
Application logs are available in the console output. Enable debug logging by adding to `application.yml`:
```yaml
logging:
  level:
    com.expensetracker: DEBUG
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Spring Boot and Java**