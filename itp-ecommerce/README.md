# ITP E-commerce (Backend)

This is a scaffolded Spring Boot + Maven backend for the ITP E-commerce project.

Features:
- Spring Boot 3.x
- Java 17
- JWT authentication skeleton
- MySQL via Docker Compose
- Basic folder structure (controllers, services, repos, models, dto)

To run locally:
1. Start DB: `docker-compose up -d`
2. Build app: `./mvnw package` or `mvn package`
3. Run: `java -jar target/itp-ecommerce-0.0.1-SNAPSHOT.jar`

Static frontend: place your home page HTML/CSS/JS in `src/main/resources/static/` — `index.html` will be served at `http://localhost:8080/`.

Sample endpoints (Postman):
- POST `/api/auth/register` {email,password,fullName}
- POST `/api/auth/login` {email,password}
- GET `/api/products` — public
- POST `/api/products` — admin (requires Bearer token)
- GET `/api/cart` — authenticated
- POST `/api/orders` — place order

Notes:
- Default seeded admin: `admin@itp.edu` / `adminpass`
- Update `jwt.secret` in `src/main/resources/application.yml` before production
- For local dev you can leave CORS open (configured for `*`) but lock origins for production