package com.hotel.hotelbooking.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.service.BookingService;
import com.hotel.hotelbooking.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
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
    public Booking createBooking(@RequestBody Booking booikng){
        return bookingService.createBooking(booikng);
    }

    @GetMapping
    public List<Booking> getAllBookings(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        userService.requireAdmin(userId);
        return bookingService.getAllBookings();
    }


    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Long id){
        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingByUserId(@PathVariable Long userId){
        return bookingService.getBookingsByUserId(userId);
    }

    @PutMapping("/{id}/cancel")
    public String cancelBooking(@PathVariable Long id){
        bookingService.cancelBooking(id);
        return "Booking cancelled successfully";
    }

}
