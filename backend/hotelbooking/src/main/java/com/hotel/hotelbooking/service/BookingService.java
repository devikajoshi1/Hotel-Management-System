package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final  BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository){
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking){
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id){
        return bookingRepository.findById(id);
    }

    public void cancelBooking(Long id){
        Booking booking = bookingRepository.findById(id).orElse(null);

        if(booking != null){
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
        }
    }
}
