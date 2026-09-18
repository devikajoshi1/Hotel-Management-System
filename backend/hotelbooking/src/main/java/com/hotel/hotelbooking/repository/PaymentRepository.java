package com.hotel.hotelbooking.repository;

import com.hotel.hotelbooking.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
