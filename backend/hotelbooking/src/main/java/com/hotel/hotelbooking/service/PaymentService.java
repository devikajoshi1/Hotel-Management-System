package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.Booking;
import com.hotel.hotelbooking.entity.Payment;
import com.hotel.hotelbooking.repository.BookingRepository;
import com.hotel.hotelbooking.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private static final List<String> PAYMENT_METHODS = List.of("UPI", "CARD", "CASH");

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Payment makePayment(Payment payment) {
        // 1. The booking must be sent and must exist
        if (payment.getBooking() == null || payment.getBooking().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Booking is required.");
        }

        Booking booking = bookingRepository.findById(payment.getBooking().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found."));

        // 2. Canceled bookings cannot be paid
        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only confirmed bookings can be paid.");
        }

        // 3. A booking can only be paid once
        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This booking has already been paid.");
        }

        // 4. Only the payment methods the app offers
        if (!PAYMENT_METHODS.contains(payment.getPaymentMethod())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Payment method must be UPI, CARD or CASH.");
        }

        // 5. The server sets the amount and status, never the browser
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentStatus("SUCCESS");

        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
