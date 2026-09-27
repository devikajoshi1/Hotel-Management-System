package com.hotel.hotelbooking.service;
import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.entity.Room;
import com.hotel.hotelbooking.repository.BookingRepository;
import com.hotel.hotelbooking.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public Booking createBooking(Booking booking) {
        LocalDate checkIn = booking.getCheckIn();
        LocalDate checkOut = booking.getCheckOut();

        // 1. Dates must be present, and check-out must come after check-in
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Check-out date must be after check-in date.");
        }

        // 2. No bookings in the past
        if (checkIn.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Check-in date cannot be in the past.");
        }

        // 3. The room must exist
        if (booking.getRoom() == null || booking.getRoom().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Room is required.");
        }

        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room not found."));

        // 4. The admin can switch a room off
        if (!room.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This room is not available for booking.");
        }

        // 5. Guest count must fit the room
        if (booking.getGuests() < 1 || booking.getGuests() > room.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "This room allows 1 to " + room.getCapacity() + " guests.");
        }

        // 6. No double booking (uses the query you wrote in File 1)
        if (bookingRepository.existsOverlappingBooking(room.getId(), checkIn, checkOut)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This room is already booked for the selected dates.");
        }

        // 7. The server calculates the price and status, never the browser
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);

        booking.setRoom(room);
        booking.setTotalPrice(nights * room.getPrice());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId){
        return bookingRepository.findByUserId(userId);
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
