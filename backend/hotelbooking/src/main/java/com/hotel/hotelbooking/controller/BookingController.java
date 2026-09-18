package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.repository.BookingRepository;
import com.hotel.hotelbooking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booikng){
        return bookingService.createBooking(booikng);
    }

    @GetMapping
    public List<Booking> getAllBookings(){
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Long id){
        return bookingService.getBookingById(id);
    }

    @PutMapping("/{id}/cancel")
    public String cancelBooking(@PathVariable Long id){
        bookingService.cancelBooking(id);
        return "Booking cancelled successfully";
    }

}
