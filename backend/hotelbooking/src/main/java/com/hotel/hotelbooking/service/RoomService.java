package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.Room;
import com.hotel.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
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

        Room existingRoom = roomRepository.findById(id).orElse(null);

        if (existingRoom != null) {

            existingRoom.setRoomNumber(room.getRoomNumber());
            existingRoom.setRoomType(room.getRoomType());
            existingRoom.setPrice(room.getPrice());
            existingRoom.setDescription(room.getDescription());
            existingRoom.setImageUrl(room.getImageUrl());
            existingRoom.setCapacity(room.getCapacity());
            existingRoom.setAvailable(room.isAvailable());

            return roomRepository.save(existingRoom);
        }

        return null;
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
