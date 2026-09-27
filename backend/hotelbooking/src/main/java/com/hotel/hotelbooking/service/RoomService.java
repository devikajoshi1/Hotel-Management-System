package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.Room;
import com.hotel.hotelbooking.repository.BookingRepository;
import com.hotel.hotelbooking.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository,
                       BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room updateRoom(Long id, Room room) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room not found."));

        existingRoom.setRoomNumber(room.getRoomNumber());
        existingRoom.setRoomType(room.getRoomType());
        existingRoom.setPrice(room.getPrice());
        existingRoom.setDescription(room.getDescription());
        existingRoom.setImageUrl(room.getImageUrl());
        existingRoom.setCapacity(room.getCapacity());
        existingRoom.setAvailable(room.isAvailable());

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Room not found.");
        }

        // Deleting a booked room would break its booking history
        if (bookingRepository.existsByRoomId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This room has bookings. Mark it unavailable instead of deleting it.");
        }

        roomRepository.deleteById(id);
    }
}
