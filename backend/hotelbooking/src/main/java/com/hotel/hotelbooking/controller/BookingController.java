package com.hotel.hotelbooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.entity.User;
import com.hotel.hotelbooking.service.BookingService;
import com.hotel.hotelbooking.service.UserService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final UserService userService;

    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking,
                                 @RequestHeader(value = "Authorization", required = false) String authorization) {
        // The booking always belongs to the logged-in user, whatever the browser sends
        User currentUser = userService.requireUser(authorization);
        booking.setUser(currentUser);
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id,
                                  @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);
        return findOwnedBooking(id, currentUser);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingByUserId(@PathVariable Long userId,
                                            @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);
        userService.requireSelfOrAdmin(currentUser, userId);
        return bookingService.getBookingsByUserId(userId);
    }

    @PutMapping("/{id}/cancel")
    public String cancelBooking(@PathVariable Long id,
                                @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);
        findOwnedBooking(id, currentUser);
        bookingService.cancelBooking(id);
        return "Booking cancelled successfully";
    }

    // Loads a booking and checks it belongs to this user (or the user is an admin)
    private Booking findOwnedBooking(Long id, User currentUser) {
        Booking booking = bookingService.getBookingById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found."));

        Long ownerId = booking.getUser() == null ? null : booking.getUser().getId();
        userService.requireSelfOrAdmin(currentUser, ownerId);
        return booking;
    }
}
