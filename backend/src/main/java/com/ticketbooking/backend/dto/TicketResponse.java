package com.ticketbooking.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class TicketResponse {

    private Long ticketId;
    private Long bookingId;
    private String ticketNumber;
    private String bookingReference;

    private String eventTitle;
    private String venueName;

    private LocalDate showDate;
    private LocalTime startTime;

    private List<String> seats;
    private BigDecimal totalAmount;

    private String bookingStatus;
    private String paymentStatus;

    private String qrCode;
    private LocalDateTime generatedAt;

    public TicketResponse(
            Long ticketId,
            Long bookingId,
            String ticketNumber,
            String bookingReference,
            String eventTitle,
            String venueName,
            LocalDate showDate,
            LocalTime startTime,
            List<String> seats,
            BigDecimal totalAmount,
            String bookingStatus,
            String paymentStatus,
            String qrCode,
            LocalDateTime generatedAt) {

        this.ticketId = ticketId;
        this.bookingId = bookingId;
        this.ticketNumber = ticketNumber;
        this.bookingReference = bookingReference;
        this.eventTitle = eventTitle;
        this.venueName = venueName;
        this.showDate = showDate;
        this.startTime = startTime;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.paymentStatus = paymentStatus;
        this.qrCode = qrCode;
        this.generatedAt = generatedAt;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public String getVenueName() {
        return venueName;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public List<String> getSeats() {
        return seats;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getQrCode() {
        return qrCode;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }
}