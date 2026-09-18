package com.hotel.hotelbooking.repository;

import com.hotel.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
