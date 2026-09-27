# Viva Notes — Luxora Hotel Booking System

## Demo script (about 5 minutes)

Before the demo: backend and frontend running, sample rooms loaded, one admin and one normal user registered, one room already booked for some dates next month.

1. **Home page** — "This is Luxora, a hotel booking system built with React, Spring Boot and MySQL." Show the featured rooms (loaded from the database) and use the search box with 3 guests → the Rooms page filters by capacity.
2. **Register and log in** as a new user. Show the Navbar change to "Hi, name".
3. **Book a room** — pick dates, show the live price preview, confirm → lands on the payment page.
4. **Double booking** — try to book the already-booked room on overlapping dates → *"This room is already booked for the selected dates."* Explain that the server checks this, not the browser.
5. **Pay** with UPI → success screen → **My Bookings** shows ✓ PAID.
6. **Log in as admin** → Admin link → dashboard numbers. Show the Bookings tab with the new booking and its payment.
7. **Rooms tab** — add a room, then disable it; try deleting a booked room → *"Mark it unavailable instead."*
8. **Security** — log in as the normal user and open `/admin` → "Admins only". Open `http://localhost:8080/api/users` → 401 "Please log in.", and point out that passwords never appear in any response.

## Architecture

**Q: Explain the architecture of your project.**
Three tiers. The React frontend runs in the browser and calls a REST API. The Spring Boot backend is layered: controllers receive HTTP requests, services hold the business rules, repositories use Spring Data JPA to read and write MySQL. Data travels as JSON.

**Q: Why separate controller, service and repository?**
Separation of concerns. Controllers deal only with HTTP, services only with rules (for example "no overlapping bookings"), repositories only with the database. Each layer can be changed or tested without rewriting the others.

**Q: What is dependency injection?**
Instead of a class creating its own dependencies with `new`, Spring creates them and passes them in. `BookingService` declares `BookingRepository` and `RoomRepository` in its constructor, and Spring supplies them. This is constructor injection.

**Q: What is CORS and why do you need `@CrossOrigin`?**
The browser blocks a page on one origin (`localhost:5173`) from calling another origin (`localhost:8080`) unless the server allows it. `@CrossOrigin(origins = "http://localhost:5173")` tells the browser the frontend is allowed.

## Database and JPA

**Q: What are the entity relationships?**
A User has many Bookings (`@ManyToOne` from Booking to User). A Room has many Bookings (`@ManyToOne` from Booking to Room). A Booking has at most one Payment (`@OneToOne` from Payment to Booking).

**Q: What does `spring.jpa.hibernate.ddl-auto=update` do?**
Hibernate compares the entity classes with the database on startup and creates or alters tables to match. Good for development; production systems use migration tools like Flyway instead.

**Q: How does `findByUserId` work without any SQL?**
Spring Data JPA derives the query from the method name: `findBy` + `User` + `Id` becomes `WHERE user_id = ?`. The same for `existsByRoomId`.

**Q: When did you write your own query?**
`existsOverlappingBooking` uses `@Query` with JPQL, because the overlap condition is too complex for a method name.

## Business logic

**Q: How do you prevent double booking?**
Before saving, the service asks the database whether the room has a non-cancelled booking where `existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn`. If yes, it returns 409 Conflict. The condition allows checking in on the same day the previous guest checks out.

**Q: Why calculate the price on the server?**
Anything from the browser can be edited with developer tools. If the browser sent the price, a user could book a ₹7,500 room for ₹1. The server looks up the room price and multiplies it by the number of nights (`ChronoUnit.DAYS.between`).

**Q: How do you stop a booking being paid twice?**
`PaymentService` checks `findByBookingId` before saving; if a payment exists it returns 409. It also only accepts payments for `CONFIRMED` bookings and sets the amount from the booking.

**Q: Why can't an admin delete a room that has bookings?**
The bookings table has a foreign key to rooms, so deleting would either fail or destroy booking history. Instead the room is marked unavailable — a soft delete.

**Q: How are errors sent to the frontend?**
Services throw `ResponseStatusException` with a status (400, 401, 403, 404, 409) and a message. `server.error.include-message=always` makes Spring include the message, and the frontend shows `error.response.data.message`.

## Security

**Q: How are passwords stored?**
As BCrypt hashes. On register, `passwordEncoder.encode()` hashes the password; on login, `passwordEncoder.matches()` hashes the typed password and compares. The original password is never stored and cannot be recovered from the hash.

**Q: Why BCrypt instead of SHA-256 or MD5?**
BCrypt adds a random salt to every password, so two users with the same password get different hashes, and it is deliberately slow, which makes guessing millions of passwords impractical. SHA-256 and MD5 are fast, which helps attackers.

**Q: How do you make sure the password is never sent back?**
`@JsonProperty(access = WRITE_ONLY)` on the password field: Jackson accepts it in requests but leaves it out of every JSON response.

**Q: How does the admin check work? Is it secure?**
Admin requests send the user's id in an `X-User-Id` header; `requireAdmin` loads the user and rejects the request unless the role is `ADMIN`. It is **not** fully secure — a client that knows an admin's id could fake the header. The proper solution is Spring Security with JWT: the server signs a token at login, the client sends it with every request, and the server verifies the signature, so it cannot be forged.

**Q: Difference between 401 and 403?**
401 Unauthorized — the server doesn't know who you are (not logged in). 403 Forbidden — it knows who you are, but you aren't allowed.

**Q: Can a user make themselves admin when registering?**
No. `registerUser` ignores the role sent by the browser and always sets `USER`. Admins are promoted in the database.

**Q: Hiding the Admin link — is that security?**
No, only convenience. The real protection is on the backend: even if someone types `/admin`, the API refuses to send the data.

## React

**Q: What is `useState` / `useEffect`?**
`useState` stores data that, when changed, re-renders the component. `useEffect` runs side effects such as API calls after rendering; its dependency array decides when it runs again (the Admin page reloads when `reloadKey` changes).

**Q: Why `Promise.all` in the Admin page?**
It sends the four requests (rooms, bookings, users, payments) at the same time and waits for all of them, which is faster than one after another.

**Q: How does routing work?**
React Router maps URLs to page components in `App.jsx`, for example `/booking/:id` → `Booking`. `useParams` reads `:id`, and `useNavigate` moves to another page after an action.

**Q: How does the app remember who is logged in?**
After login the user object is saved in `localStorage`. Pages read it to know the user id and role; Logout removes it.

## Limitations — say these before they ask

- Simplified authentication (header instead of JWT).
- Payments are simulated; a real app would use Razorpay or Stripe.
- No refund when a paid booking is cancelled.
- The Rooms page doesn't check date availability; the booking step does.
