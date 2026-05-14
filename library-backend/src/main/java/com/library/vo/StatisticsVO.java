package com.library.vo;

import java.math.BigDecimal;

public class StatisticsVO {
    private Long totalBooks;
    private Long totalUsers;
    private Long totalBorrows;
    private Long currentBorrows;
    private Long overdueBorrows;
    private Long totalComments;
    private BigDecimal averageRating;

    public Long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(Long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalBorrows() {
        return totalBorrows;
    }

    public void setTotalBorrows(Long totalBorrows) {
        this.totalBorrows = totalBorrows;
    }

    public Long getCurrentBorrows() {
        return currentBorrows;
    }

    public void setCurrentBorrows(Long currentBorrows) {
        this.currentBorrows = currentBorrows;
    }

    public Long getOverdueBorrows() {
        return overdueBorrows;
    }

    public void setOverdueBorrows(Long overdueBorrows) {
        this.overdueBorrows = overdueBorrows;
    }

    public Long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(Long totalComments) {
        this.totalComments = totalComments;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }
}
