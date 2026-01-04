# InfoNest Backend Specification
**Version:** 1.0  
**Date:** January 4, 2026  
**Technology Stack:** Spring Boot + PostgreSQL + JWT Authentication

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Authentication System (Priority 1)](#authentication-system)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Request/Response Examples](#request-response-examples)
7. [Security Requirements](#security-requirements)
8. [Next Steps](#next-steps)

---

## Project Overview

InfoNest is a comprehensive college management platform with three main modules:
- **Club Management** - Student clubs, events, registrations
- **Schedule Management** - Teacher/classroom/batch schedules
- **Venue Booking** - Room and venue reservations

### Current State
- Frontend is built with React + TypeScript
- Mock data layer simulates backend responses
- API client is configured to point to `http://localhost:8080/api/v1`
- JWT token authentication flow is implemented in frontend

---

## Technology Stack

### Backend Requirements
- **Framework:** Spring Boot 3.x
- **Database:** PostgreSQL 15+
- **Authentication:** JWT (JSON Web Tokens)
- **API Style:** RESTful
- **Base URL:** `http://localhost:8080/api/v1`

### Required Dependencies (pom.xml)
```xml
<!-- Spring Boot Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Security + JWT -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## Authentication System (Priority 1)

### JWT Configuration
- **Token Type:** Bearer
- **Header:** `Authorization: Bearer <token>`
- **Expiration:** 1 hour (3600000ms)
- **Refresh Token:** Optional (can implement later)
- **Storage:** Frontend stores token in `localStorage` as `auth_token`

### User Roles
```java
public enum UserRole {
    STUDENT,
    FACULTY,
    ADMIN,
    OFFICE
}
```

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    private String department;
    
    private String clubId; // For faculty advisors
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Getters and Setters
}
```

---

## Database Schema

### Priority 1: Authentication Tables

#### `users` table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt hashed
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- STUDENT, FACULTY, ADMIN, OFFICE
    department VARCHAR(255),
    club_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Priority 2: Club Management Tables

#### `clubs` table
```sql
CREATE TABLE clubs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,  -- Tech, Cultural, Sports, Literature, Social
    description TEXT,
    about TEXT,
    logo TEXT,
    founded VARCHAR(10),
    total_members INTEGER DEFAULT 0,
    achievements INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    president_id VARCHAR(36),
    vice_president_id VARCHAR(36),
    faculty_advisor_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (faculty_advisor_id) REFERENCES users(id)
);

CREATE INDEX idx_clubs_category ON clubs(category);
CREATE INDEX idx_clubs_active ON clubs(is_active);
```

#### `events` table
```sql
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    club_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,  -- Workshop, Hackathon, Conference, Competition, Event, Seminar
    date DATE NOT NULL,
    time VARCHAR(100),
    venue VARCHAR(255),
    capacity INTEGER,
    registered_count INTEGER DEFAULT 0,
    requires_resume BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);
```

#### `registrations` table
```sql
CREATE TABLE registrations (
    registration_id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, APPROVED, REJECTED
    resume_url TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(event_id, user_id)
);

CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
```

### Priority 3: Schedule & Venue Tables

#### `schedules` table
```sql
CREATE TABLE schedules (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,  -- teacher, classroom, batch
    entity_id VARCHAR(255) NOT NULL,  -- Teacher name, Classroom code, or Batch name
    scheduled_location VARCHAR(255),
    current_location VARCHAR(255),
    details TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schedules_type ON schedules(type);
CREATE INDEX idx_schedules_entity ON schedules(entity_id);
```

#### `venues` table
```sql
CREATE TABLE venues (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER,
    type VARCHAR(100),  -- Lecture Hall, Lab, Auditorium, Seminar Hall
    available BOOLEAN DEFAULT true,
    amenities TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venues_type ON venues(type);
CREATE INDEX idx_venues_available ON venues(available);
```

#### `venue_bookings` table
```sql
CREATE TABLE venue_bookings (
    id VARCHAR(36) PRIMARY KEY,
    venue_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    purpose TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_bookings_venue ON venue_bookings(venue_id);
CREATE INDEX idx_bookings_user ON venue_bookings(user_id);
CREATE INDEX idx_bookings_time ON venue_bookings(start_time, end_time);
```

---

## API Endpoints

### 1. Authentication Endpoints (PRIORITY 1)

#### **POST** `/api/v1/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "password123",
  "name": "John Doe",
  "role": "student",
  "department": "Computer Science"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@college.edu",
    "name": "John Doe",
    "role": "student",
    "department": "Computer Science",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already exists",
  "error": "DUPLICATE_EMAIL",
  "timestamp": "2026-01-04T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```

---

#### **POST** `/api/v1/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "password123",
  "role": "student"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@college.edu",
    "name": "John Doe",
    "role": "student",
    "department": "Computer Science",
    "clubId": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS",
  "timestamp": "2026-01-04T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

**Important Notes:**
- Password must be verified using BCrypt
- JWT token should include: `userId`, `email`, `role` in payload
- Token expiration: 1 hour
- Return user data WITHOUT password field

---

#### **GET** `/api/v1/auth/me`
Get current authenticated user details.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@college.edu",
    "name": "John Doe",
    "role": "student",
    "department": "Computer Science",
    "clubId": null
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authenticated",
  "error": "UNAUTHORIZED",
  "timestamp": "2026-01-04T10:30:00Z",
  "path": "/api/v1/auth/me"
}
```

---

#### **POST** `/api/v1/auth/logout`
Logout user (optional: invalidate token on backend).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2. Club Management Endpoints

#### **GET** `/api/v1/clubs`
Get all clubs with optional filters.

**Query Parameters:**
- `category` (optional): Tech, Cultural, Sports, Literature, Social
- `isActive` (optional): true/false
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "acm",
      "name": "ACM Chapter",
      "category": "Tech",
      "description": "Association for Computing Machinery",
      "about": "Leading tech community...",
      "logo": "💻",
      "founded": "2015",
      "totalMembers": 120,
      "achievements": 15,
      "isActive": true,
      "president": {
        "id": "1",
        "name": "Alice Johnson",
        "email": "alice@college.edu"
      },
      "vicePresident": {
        "id": "2",
        "name": "Bob Smith",
        "email": "bob@college.edu"
      },
      "facultyAdvisor": {
        "id": "user-faculty",
        "name": "Dr. Sarah Johnson",
        "email": "sarah@college.edu",
        "department": "Computer Science"
      },
      "createdAt": "2015-01-01T00:00:00Z",
      "updatedAt": "2026-01-04T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 25,
    "totalPages": 2
  }
}
```

---

#### **GET** `/api/v1/clubs/{clubId}`
Get club details by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "acm",
    "name": "ACM Chapter",
    "category": "Tech",
    "description": "Association for Computing Machinery",
    "about": "Leading tech community...",
    "logo": "💻",
    "founded": "2015",
    "totalMembers": 120,
    "achievements": 15,
    "isActive": true,
    "president": {...},
    "vicePresident": {...},
    "facultyAdvisor": {...},
    "upcomingEvents": [
      {
        "id": "event-1",
        "title": "Web Development Workshop",
        "date": "2025-11-15",
        "venue": "Navmandir Auditorium"
      }
    ],
    "createdAt": "2015-01-01T00:00:00Z",
    "updatedAt": "2026-01-04T10:00:00Z"
  }
}
```

---

#### **POST** `/api/v1/clubs`
Create a new club (Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "New Club",
  "category": "Tech",
  "description": "Club description",
  "about": "Detailed information",
  "logo": "🚀",
  "founded": "2026"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "id": "generated-uuid",
    "name": "New Club",
    "category": "Tech",
    "totalMembers": 0,
    "achievements": 0,
    "isActive": true,
    "createdAt": "2026-01-04T10:30:00Z"
  }
}
```

---

#### **PUT** `/api/v1/clubs/{clubId}`
Update club details (Admin or Faculty Advisor only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "description": "Updated description",
  "about": "Updated detailed info"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Club updated successfully",
  "data": {
    "id": "acm",
    "updatedAt": "2026-01-04T10:30:00Z"
  }
}
```

---

### 3. Event Management Endpoints

#### **GET** `/api/v1/events`
Get all events with filters.

**Query Parameters:**
- `clubId` (optional)
- `type` (optional): Workshop, Hackathon, etc.
- `upcoming` (optional): true/false
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date
- `page`, `size`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-1",
      "clubId": "acm",
      "clubName": "ACM Chapter",
      "clubLogo": "💻",
      "clubCategory": "Tech",
      "title": "Web Development Workshop",
      "description": "Learn modern web development...",
      "type": "Workshop",
      "date": "2025-11-15",
      "time": "10:00 AM - 4:00 PM",
      "venue": "Navmandir Auditorium",
      "capacity": 250,
      "registeredCount": 180,
      "requiresResume": false,
      "isActive": true,
      "createdAt": "2025-10-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

#### **POST** `/api/v1/events`
Create new event (Faculty or Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "clubId": "acm",
  "title": "AI Workshop",
  "description": "Introduction to AI",
  "type": "Workshop",
  "date": "2026-02-15",
  "time": "2:00 PM - 5:00 PM",
  "venue": "Lab 301",
  "capacity": 50,
  "requiresResume": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "generated-uuid",
    "registeredCount": 0,
    "isActive": true,
    "createdAt": "2026-01-04T10:30:00Z"
  }
}
```

---

#### **POST** `/api/v1/events/{eventId}/register`
Register for an event (Student only).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data  (if resume is included)
```

**Request Body (Form Data):**
- `resumeFile` (optional): File upload if event requires resume

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration successful! Check your email for confirmation.",
  "data": {
    "registrationId": "generated-uuid",
    "eventId": "event-1",
    "userId": "user-id",
    "status": "APPROVED",
    "registeredAt": "2026-01-04T10:30:00Z"
  }
}
```

**Note:** If event requires resume, status should be "PENDING" until faculty approval.

---

#### **GET** `/api/v1/events/{eventId}/registrations`
Get all registrations for an event (Faculty/Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED
- `page`, `size`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "registrationId": "reg-1",
      "eventId": "event-1",
      "userId": "user-student",
      "user": {
        "id": "user-student",
        "name": "Alex Student",
        "email": "alex@college.edu",
        "department": "Computer Science"
      },
      "status": "PENDING",
      "resumeUrl": "https://storage.example.com/resume.pdf",
      "registeredAt": "2026-01-04T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

---

#### **PUT** `/api/v1/events/{eventId}/registrations/{registrationId}`
Update registration status (Faculty/Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration approved successfully"
}
```

---

#### **GET** `/api/v1/events/my-registrations`
Get current user's event registrations (Student only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "registrationId": "reg-1",
      "eventId": "event-1",
      "status": "APPROVED",
      "registeredAt": "2026-01-04T10:30:00Z",
      "event": {
        "id": "event-1",
        "title": "Web Development Workshop",
        "clubName": "ACM Chapter",
        "date": "2025-11-15",
        "time": "10:00 AM - 4:00 PM",
        "venue": "Navmandir Auditorium"
      }
    }
  ]
}
```

---

### 4. Schedule Endpoints

#### **GET** `/api/v1/schedule`
Get schedule data.

**Query Parameters:**
- `type` (required): teacher, classroom, batch
- `query` (optional): Search term

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "Dr. Sarah Johnson",
      "scheduledLocation": "CMS-202",
      "currentLocation": "CMS-201",
      "details": "Dr. Sarah Johnson",
      "lastUpdated": "2026-01-04T10:30:00Z"
    }
  ]
}
```

---

### 5. Venue Endpoints

#### **GET** `/api/v1/venues`
Get all venues.

**Query Parameters:**
- `type` (optional): Lecture Hall, Lab, Auditorium, Seminar Hall
- `capacity` (optional): Minimum capacity
- `available` (optional): true/false

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "AUD-01",
      "name": "Navmandir Auditorium",
      "capacity": 300,
      "type": "Auditorium",
      "available": true,
      "amenities": ["Projector", "Audio System", "AC"]
    }
  ]
}
```

---

#### **POST** `/api/v1/venues/book`
Book a venue.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "venueId": "AUD-01",
  "purpose": "Club Event",
  "startTime": "2026-01-10T14:00:00Z",
  "endTime": "2026-01-10T17:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Venue booked successfully",
  "data": {
    "id": "booking-uuid",
    "venueId": "AUD-01",
    "status": "PENDING"
  }
}
```

---

## Security Requirements

### 1. JWT Token Implementation

**Token Generation:**
```java
// Example JWT utility class
public class JwtUtil {
    private static final String SECRET = "your-secret-key-here"; // Use environment variable
    private static final long EXPIRATION = 3600000; // 1 hour
    
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("userId", user.getId())
            .claim("role", user.getRole())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(SignatureAlgorithm.HS256, SECRET)
            .compact();
    }
    
    public Claims validateToken(String token) {
        return Jwts.parser()
            .setSigningKey(SECRET)
            .parseClaimsJws(token)
            .getBody();
    }
}
```

### 2. Password Security
- Use BCrypt for password hashing
- Minimum password length: 8 characters
- Never return password in API responses

### 3. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173"); // React dev server
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### 4. Error Response Format
All errors must follow this format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "timestamp": "2026-01-04T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Invalid or missing token (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `NOT_FOUND` - Resource not found (404)
- `INVALID_CREDENTIALS` - Login failed (401)
- `DUPLICATE_EMAIL` - Email already exists (400)
- `VALIDATION_ERROR` - Invalid request data (400)

---

## Request/Response Examples

### Example: Complete Login Flow

**1. User sends login request:**
```bash
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "alex@college.edu",
  "password": "password123",
  "role": "student"
}
```

**2. Backend validates credentials:**
- Query user by email
- Verify password using BCrypt
- Check if user role matches

**3. Backend generates JWT token:**
```java
User user = userRepository.findByEmail("alex@college.edu");
String token = jwtUtil.generateToken(user);
```

**4. Backend returns response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@college.edu",
    "name": "Alex Student",
    "role": "student",
    "department": "Computer Science",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4QGNvbGxlZ2UuZWR1IiwidXNlcklkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MDQ4NzU0MDAsImV4cCI6MTcwNDg3OTAwMH0.abc123xyz"
  }
}
```

**5. Frontend stores token:**
```javascript
localStorage.setItem('auth_token', response.data.token);
localStorage.setItem('user_data', JSON.stringify(response.data));
```

**6. Frontend makes authenticated request:**
```bash
GET http://localhost:8080/api/v1/events/my-registrations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**7. Backend validates token:**
```java
String token = request.getHeader("Authorization").substring(7); // Remove "Bearer "
Claims claims = jwtUtil.validateToken(token);
String userId = claims.get("userId", String.class);
```

---

## Next Steps

### Phase 1: Authentication Setup (Week 1)
**Goal:** Complete user authentication system

**Tasks:**
1. Setup PostgreSQL database
2. Create `users` table
3. Implement User entity and repository
4. Implement JWT utility class
5. Create AuthController with endpoints:
   - POST /auth/register
   - POST /auth/login
   - GET /auth/me
   - POST /auth/logout
6. Configure Spring Security
7. Test all auth endpoints with Postman/Thunder Client

**Deliverables:**
- Working authentication API
- Postman collection with test cases
- Database migration scripts

### Phase 2: Club Management (Week 2)
1. Create clubs, events, registrations tables
2. Implement JPA entities
3. Create ClubController, EventController
4. Implement all club/event endpoints

### Phase 3: Schedule & Venue (Week 3)
1. Create schedules, venues, venue_bookings tables
2. Implement ScheduleController, VenueController
3. Implement booking logic

### Phase 4: Integration & Testing (Week 4)
1. Integration testing with frontend
2. Performance optimization
3. Bug fixes and refinements

---

## Testing the Integration

### Switch from Mock to Real Backend

In `/utils/api.ts`, change:
```typescript
const USE_MOCK_DATA = false; // Switch to real backend
```

### Test User Accounts

Create these test users in your database:

```sql
-- Student
INSERT INTO users (id, email, password, name, role, department) VALUES
('user-student', 'alex@college.edu', '$2a$10$...', 'Alex Student', 'STUDENT', 'Computer Science');

-- Faculty
INSERT INTO users (id, email, password, name, role, department, club_id) VALUES
('user-faculty', 'sarah@college.edu', '$2a$10$...', 'Dr. Sarah Johnson', 'FACULTY', 'Computer Science', 'acm');

-- Admin
INSERT INTO users (id, email, password, name, role) VALUES
('user-admin', 'admin@college.edu', '$2a$10$...', 'Admin User', 'ADMIN');
```

Password: `password123` (hashed with BCrypt)

---

## Contact & Support

**Frontend Developer:** [Your Contact]  
**API Base URL:** `http://localhost:8080/api/v1`  
**Frontend URL:** `http://localhost:5173`

**Questions?**
- Check existing mock data in `/utils/mockData.ts`
- Review API client code in `/utils/api.ts`
- Test with mock data first before implementing

---

**Document Version:** 1.0  
**Last Updated:** January 4, 2026
