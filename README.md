# Luxora — Hotel Booking System

A full-stack hotel booking application. Guests can browse rooms, book a stay, pay for it and manage their bookings. Admins manage rooms and see every booking, user and payment from a dashboard.

**Tech stack**

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Java 21, Spring Boot 4, Spring Data JPA (Hibernate) |
| Database | MySQL |
| Security | BCrypt password hashing (`spring-security-crypto`) |

## Screenshots

| Home | Rooms |
|---|---|
| ![Home page](screenshots/home.png) | ![Rooms page](screenshots/rooms.png) |

| Booking | My Bookings |
|---|---|
| ![Booking page](screenshots/booking.png) | ![My Bookings page](screenshots/my-bookings.png) |

| Payment | Admin dashboard |
|---|---|
| ![Payment page](screenshots/payment.png) | ![Admin dashboard](screenshots/admin.png) |

## Features

**Guests**
- Register and log in (passwords are stored as BCrypt hashes)
- Browse rooms, filter by number of guests, view room details
- Book a room with live price preview
- Pay for a booking (UPI, card or cash — simulated)
- View, pay for and cancel their bookings

**Admins**
- Dashboard with total rooms, confirmed bookings, users and revenue
- Add, edit, enable/disable and delete rooms
- View all bookings with guest, dates, payment and status; filter and cancel

**Business rules enforced by the server**
- Check-out must be after check-in; no bookings in the past
- Guest count must fit the room's capacity
- A room cannot be double-booked for overlapping dates
- The booking price and payment amount are calculated on the server, never trusted from the browser
- A booking can be paid only once, and only while it is confirmed
- A room with bookings cannot be deleted — it is marked unavailable instead
- New accounts always get the `USER` role; admin endpoints reject non-admins

## Project structure

```
Hotel management System/
├── backend/hotelbooking/          Spring Boot API
│   └── src/main/java/com/hotel/hotelbooking/
│       ├── entity/                User, Room, Booking, Payment (JPA entities)
│       ├── repository/            Spring Data JPA repositories
│       ├── service/               Business rules and validation
│       └── controller/            REST endpoints
├── frontend/                      React app
│   └── src/
│       ├── components/            Navbar, Hero, BookingSearch, FeaturedRooms, RoomCard, Footer
│       └── pages/                 Home, Rooms, RoomDetails, Booking, Payment, MyBookings,
│                                  Login, Register, Admin
└── database/seed.sql              The 10 hotel rooms for a fresh database
```

The backend follows a layered architecture: **Controller → Service → Repository → Database**. Controllers handle HTTP, services hold the business rules, repositories talk to MySQL.

## Data model

```
User 1 ──── * Booking * ──── 1 Room
                 │
                 1
                 │
              0..1 Payment
```

| Table | Main columns |
|---|---|
| `users` | id, name, email, password (BCrypt hash), role (`USER` / `ADMIN`) |
| `rooms` | id, room_number, room_type, price, capacity, description, image_url, available |
| `bookings` | id, user_id, room_id, check_in, check_out, guests, total_price, status (`CONFIRMED` / `CANCELLED`) |
| `payments` | id, booking_id, amount, payment_method (`UPI` / `CARD` / `CASH`), payment_status |

## API

Endpoints marked **Admin** need the header `X-User-Id` set to the id of an admin user.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/users/register` | Create an account | Public |
| POST | `/api/users/login` | Log in (401 on wrong email or password) | Public |
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/{id}` | Get one user | Public |
| GET | `/api/rooms` | List rooms | Public |
| GET | `/api/rooms/{id}` | Get one room | Public |
| POST | `/api/rooms` | Add a room | Admin |
| PUT | `/api/rooms/{id}` | Update a room | Admin |
| DELETE | `/api/rooms/{id}` | Delete a room without bookings | Admin |
| POST | `/api/bookings` | Create a booking (validated, price set by server) | Public |
| GET | `/api/bookings` | List all bookings | Admin |
| GET | `/api/bookings/{id}` | Get one booking | Public |
| GET | `/api/bookings/user/{userId}` | A user's bookings | Public |
| PUT | `/api/bookings/{id}/cancel` | Cancel a booking | Public |
| POST | `/api/payments` | Pay for a booking (amount set by server) | Public |
| GET | `/api/payments` | List all payments | Admin |
| GET | `/api/payments/{id}` | Get one payment | Public |
| GET | `/api/payments/booking/{bookingId}` | Payment for a booking | Public |

Errors come back with an HTTP status and a message, for example `409 Conflict — "This room is already booked for the selected dates."`

## Running locally

**Requirements:** Java 21, Node.js 20.19+ (or 22.12+), MySQL 8.

1. **Create the database**
   ```sql
   CREATE DATABASE hotel_booking;
   ```

2. **Configure the backend**
   ```bash
   cd backend/hotelbooking/src/main/resources
   cp application-example.properties application.properties
   ```
   Put your MySQL password in `application.properties`. This file is git-ignored.

3. **Start the backend** (runs on http://localhost:8080 and creates the tables)
   ```bash
   cd backend/hotelbooking
   ./mvnw spring-boot:run
   ```

4. **Add the rooms** — run `database/seed.sql` once (adds the 10 hotel rooms) in MySQL Workbench or:
   ```bash
   mysql -u root -p < database/seed.sql
   ```

5. **Start the frontend** (runs on http://localhost:5173)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Create an admin** — register in the app, then in MySQL:
   ```sql
   SELECT id, email, role FROM users;
   UPDATE users SET role = 'ADMIN' WHERE id = <your id>;
   ```
   Log out and log in again to see the **Admin** link.

## Known limitations and future work

- **Authentication is simplified.** The logged-in user is kept in the browser's `localStorage`, and admin requests identify the user with an `X-User-Id` header, which a client could fake. A production version would use **Spring Security with JWT tokens** signed by the server.
- **Payments are simulated.** A real deployment would integrate a gateway such as Razorpay or Stripe and mark a payment successful only after the gateway confirms it.
- Cancelling a paid booking does not issue a refund.
- Room search filters by guests only; it does not yet check availability for specific dates on the Rooms page (the booking itself is still checked for overlaps).
- The API base URL `http://localhost:8080` is hard-coded in the frontend.
