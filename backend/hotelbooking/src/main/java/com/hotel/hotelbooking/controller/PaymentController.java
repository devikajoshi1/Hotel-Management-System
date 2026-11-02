package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.entity.Payment;
import com.hotel.hotelbooking.entity.User;
import com.hotel.hotelbooking.service.BookingService;
import com.hotel.hotelbooking.service.PaymentService;
import com.hotel.hotelbooking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService,
                             BookingService bookingService,
                             UserService userService) {
        this.paymentService = paymentService;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping
    public Payment makePayment(@RequestBody Payment payment,
                               @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);

        // Only the guest who made the booking (or an admin) can pay for it
        if (payment.getBooking() != null && payment.getBooking().getId() != null) {
            bookingService.getBookingById(payment.getBooking().getId())
                    .ifPresent(booking -> userService.requireSelfOrAdmin(currentUser, ownerOf(booking)));
        }

        return paymentService.makePayment(payment);
    }

    @GetMapping
    public List<Payment> getAllPayments(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        return paymentService.getAllPayments();
    }

    @GetMapping("/booking/{bookingId}")
    public Optional<Payment> getPaymentByBookingId(
            @PathVariable Long bookingId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);

        Booking booking = bookingService.getBookingById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found."));
        userService.requireSelfOrAdmin(currentUser, ownerOf(booking));

        return paymentService.getPaymentByBookingId(bookingId);
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id,
                                  @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);

        Payment payment = paymentService.getPaymentById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Payment not found."));
        userService.requireSelfOrAdmin(currentUser, ownerOf(payment.getBooking()));

        return payment;
    }

    private Long ownerOf(Booking booking) {
        if (booking == null || booking.getUser() == null) {
            return null;
        }
        return booking.getUser().getId();
    }
}
