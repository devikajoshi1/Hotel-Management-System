package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.Room;
import com.hotel.hotelbooking.service.RoomService;
import com.hotel.hotelbooking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;

    public RoomController(RoomService roomService, UserService userService) {
        this.roomService = roomService;
        this.userService = userService;
    }

    @PostMapping
    public Room addRoom(@RequestBody Room room,
                        @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        return roomService.addRoom(room);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Optional<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id,
                           @RequestBody Room room,
                           @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    public String deleteRoomById(@PathVariable Long id,
                                 @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }
}
