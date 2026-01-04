# JWT Authentication Implementation Guide

**For Spring Boot Backend Developers**

---

## Quick Start Checklist

- [ ] Add JWT dependencies to `pom.xml`
- [ ] Create `JwtUtil` class
- [ ] Create `JwtAuthenticationFilter`
- [ ] Configure Spring Security
- [ ] Implement AuthController
- [ ] Test with Postman

---

## 1. Add Dependencies (pom.xml)

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- BCrypt is included in Spring Security -->
```

---

## 2. Application Properties

**File:** `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080

# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/infonest_db
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=your-super-secret-key-change-this-in-production-minimum-256-bits
jwt.expiration=3600000

# CORS (Allow frontend on localhost:5173)
cors.allowed.origins=http://localhost:5173
```

**IMPORTANT:**

- Change `jwt.secret` to a strong, random string (minimum 256 bits)
- Never commit secrets to Git - use environment variables in production

---

## 3. Create User Entity

**File:** `src/main/java/com/infonest/model/User.java`

```java
package com.infonest.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "club_id")
    private String clubId; // For faculty advisors

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**File:** `src/main/java/com/infonest/model/UserRole.java`

```java
package com.infonest.model;

public enum UserRole {
    STUDENT,
    FACULTY,
    ADMIN,
    OFFICE
}
```

---

## 4. Create User Repository

**File:** `src/main/java/com/infonest/repository/UserRepository.java`

```java
package com.infonest.repository;

import com.infonest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

---

## 5. Create JWT Utility Class

**File:** `src/main/java/com/infonest/security/JwtUtil.java`

```java
package com.infonest.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate token with user details
    public String generateToken(String userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract claims from token
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // Extract userId from token
    public String extractUserId(String token) {
        return extractClaims(token).get("userId", String.class);
    }

    // Extract role from token
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // Check if token is expired
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // Validate token
    public boolean validateToken(String token, String email) {
        try {
            final String tokenEmail = extractEmail(token);
            return (tokenEmail.equals(email) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

---

## 6. Create JWT Authentication Filter

**File:** `src/main/java/com/infonest/security/JwtAuthenticationFilter.java`

```java
package com.infonest.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
            } catch (Exception e) {
                logger.error("JWT token extraction failed: " + e.getMessage());
            }
        }

        // Validate token and set authentication
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token, email)) {
                String role = jwtUtil.extractRole(token);
                String userId = jwtUtil.extractUserId(token);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // Add userId to request attributes for easy access in controllers
                request.setAttribute("userId", userId);
                request.setAttribute("userRole", role);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

---

## 7. Configure Spring Security

**File:** `src/main/java/com/infonest/config/SecurityConfig.java`

```java
package com.infonest.config;

import com.infonest.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()

                // Admin-only endpoints
                .requestMatchers("/api/v1/clubs/**").hasAnyRole("ADMIN", "FACULTY")

                // Authenticated endpoints
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## 8. Create DTOs (Data Transfer Objects)

**File:** `src/main/java/com/infonest/dto/ApiResponse.java`

```java
package com.infonest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
```

**File:** `src/main/java/com/infonest/dto/RegisterRequest.java`

```java
package com.infonest.dto;

import com.infonest.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String name;

    @NotNull
    private UserRole role;

    private String department;
}
```

**File:** `src/main/java/com/infonest/dto/LoginRequest.java`

```java
package com.infonest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String role;
}
```

**File:** `src/main/java/com/infonest/dto/AuthResponse.java`

```java
package com.infonest.dto;

import com.infonest.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String id;
    private String email;
    private String name;
    private UserRole role;
    private String department;
    private String clubId;
    private String token;
}
```

---

## 9. Create Auth Service

**File:** `src/main/java/com/infonest/service/AuthService.java`

```java
package com.infonest.service;

import com.infonest.dto.AuthResponse;
import com.infonest.dto.LoginRequest;
import com.infonest.dto.RegisterRequest;
import com.infonest.exception.BadRequestException;
import com.infonest.exception.UnauthorizedException;
import com.infonest.model.User;
import com.infonest.repository.UserRepository;
import com.infonest.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        // Save user
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        // Return response
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getDepartment(),
            user.getClubId(),
            token
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Optional: Verify role if provided
        if (request.getRole() != null && !user.getRole().name().equalsIgnoreCase(request.getRole())) {
            throw new UnauthorizedException("Invalid role for this user");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        // Return response
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getDepartment(),
            user.getClubId(),
            token
        );
    }

    public User getCurrentUser(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
}
```

---

## 10. Create Auth Controller

**File:** `src/main/java/com/infonest/controller/AuthController.java`

```java
package com.infonest.controller;

import com.infonest.dto.*;
import com.infonest.model.User;
import com.infonest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestAttribute("userId") String userId) {
        User user = authService.getCurrentUser(userId);
        // Remove password from response
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(null, user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // With JWT, logout is handled client-side by removing the token
        // Optionally, you can implement token blacklisting here
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
}
```

---

## 11. Create Exception Handlers

**File:** `src/main/java/com/infonest/exception/BadRequestException.java`

```java
package com.infonest.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
```

**File:** `src/main/java/com/infonest/exception/UnauthorizedException.java`

```java
package com.infonest.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

**File:** `src/main/java/com/infonest/exception/GlobalExceptionHandler.java`

```java
package com.infonest.exception;

import com.infonest.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("error", "BAD_REQUEST");
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("error", "UNAUTHORIZED");
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "An unexpected error occurred");
        error.put("error", "INTERNAL_SERVER_ERROR");
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## 12. Testing with Postman

### Test 1: Register New User

```
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@college.edu",
  "password": "password123",
  "name": "Test Student",
  "role": "STUDENT",
  "department": "Computer Science"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "550e8400-...",
    "email": "test@college.edu",
    "name": "Test Student",
    "role": "STUDENT",
    "department": "Computer Science",
    "clubId": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 2: Login

```
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@college.edu",
  "password": "password123",
  "role": "student"
}
```

### Test 3: Get Current User

```
GET http://localhost:8080/api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Common Issues & Solutions

### Issue 1: CORS Error

**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** Check `SecurityConfig.java` CORS configuration matches frontend URL

### Issue 2: Token Validation Fails

**Error:** "JWT signature does not match"

**Solution:** Ensure `jwt.secret` is at least 256 bits (32 characters)

### Issue 3: Password Not Matching

**Error:** "Invalid credentials"

**Solution:** Verify BCrypt is encoding passwords correctly during registration

### Issue 4: 401 on Protected Routes

**Error:** Unauthorized

**Solution:**

- Check token is being sent with `Bearer ` prefix
- Verify token hasn't expired
- Check JwtAuthenticationFilter is running

---

## Frontend Integration Test

Once backend is running:

1. **Update Frontend:**

   ```typescript
   // In /utils/api.ts
   const USE_MOCK_DATA = false;
   ```

2. **Test Login Flow:**
   - Go to `http://localhost:5173/login`
   - Login with test credentials
   - Check browser console for API calls
   - Verify token is stored in localStorage

3. **Test Protected Routes:**
   - Navigate to dashboard
   - Check Network tab for Authorization header
   - Verify API calls succeed

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Use environment variables for `jwt.secret`
   - Add `.env` to `.gitignore`

2. **Use strong JWT secret**
   - Minimum 256 bits
   - Random, not a dictionary word

3. **Implement token refresh**
   - Add refresh token endpoint for better security

4. **Rate limiting**
   - Limit login attempts to prevent brute force

5. **HTTPS in production**
   - Never use HTTP for authentication in production

---

## Next Steps

✅ Complete authentication setup  
⬜ Test with frontend  
⬜ Implement club endpoints  
⬜ Implement event endpoints  
⬜ Deploy to production

---

**Questions? Issues?**
Refer to `BACKEND_SPECIFICATION.md` for complete API documentation.