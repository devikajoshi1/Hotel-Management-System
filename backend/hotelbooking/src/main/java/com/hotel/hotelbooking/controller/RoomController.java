package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.Room;
import com.hotel.hotelbooking.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room){
        return roomService.addRoom(room);
    }

    @GetMapping
    public List<Room> getAllRooms(){
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Optional<Room> getRoomById(@PathVariable Long id){
        return roomService.getRoomById(id);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room room){
        return roomService.updateRoom(id,room);
    }

    @DeleteMapping("/{id}")
    public String deleteRoomById(@PathVariable Long id){
        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }

}
