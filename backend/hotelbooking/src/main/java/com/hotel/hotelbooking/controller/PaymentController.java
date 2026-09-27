package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.Payment;
import com.hotel.hotelbooking.service.PaymentService;
import com.hotel.hotelbooking.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }


    @PostMapping
    public Payment makePayment(@RequestBody Payment payment) {
        return paymentService.makePayment(payment);
    }

    @GetMapping
    public List<Payment> getAllPayments(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        userService.requireAdmin(userId);
        return paymentService.getAllPayments();
    }

    @GetMapping("/booking/{bookingId}")
    public Optional<Payment> getPaymentByBookingId(
            @PathVariable Long bookingId) {

        return paymentService.getPaymentByBookingId(bookingId);
    }

    @GetMapping("/{id}")
    public Optional<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }



}
