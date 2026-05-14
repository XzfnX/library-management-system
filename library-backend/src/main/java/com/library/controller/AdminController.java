package com.library.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.library.common.Result;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.mapper.BookMapper;
import com.library.mapper.BorrowRecordMapper;
import com.library.mapper.UserMapper;
import com.library.vo.StatisticsVO;
import com.library.vo.UserVO;
import com.library.vo.BookVO;
import com.library.vo.BorrowRecordVO;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserMapper userMapper;
    private final BookMapper bookMapper;
    private final BorrowRecordMapper borrowRecordMapper;

    @Autowired
    public AdminController(UserMapper userMapper, BookMapper bookMapper, BorrowRecordMapper borrowRecordMapper) {
        this.userMapper = userMapper;
        this.bookMapper = bookMapper;
        this.borrowRecordMapper = borrowRecordMapper;
    }

    @GetMapping("/users")
    public Result<List<UserVO>> getUserList() {
        List<User> users = userMapper.selectList(null);
        List<UserVO> voList = users.stream().map(user -> {
            UserVO vo = new UserVO();
            vo.setId(user.getId());
            vo.setUsername(user.getUsername());
            vo.setEmail(user.getEmail());
            vo.setPhone(user.getPhone());
            vo.setAvatar(user.getAvatar());
            vo.setRole(user.getRole());
            vo.setCreatedAt(user.getCreatedAt());
            return vo;
        }).collect(Collectors.toList());
        return Result.success(voList);
    }

    @PutMapping("/users/{id}/status")
    public Result<Void> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.fail("用户不存在");
        }
        user.setStatus(status);
        userMapper.updateById(user);
        return Result.success(null);
    }

    @GetMapping("/books")
    public Result<List<BookVO>> getAllBooks() {
        List<Book> books = bookMapper.selectList(null);
        List<BookVO> voList = books.stream().map(book -> {
            BookVO vo = new BookVO();
            vo.setId(book.getId());
            vo.setTitle(book.getTitle());
            vo.setAuthor(book.getAuthor());
            vo.setIsbn(book.getIsbn());
            vo.setPublisher(book.getPublisher());
            vo.setPublishDate(book.getPublishDate());
            vo.setCategory(book.getCategory());
            vo.setDescription(book.getDescription());
            vo.setCoverUrl(book.getCoverUrl());
            vo.setStock(book.getStock());
            vo.setRating(book.getRating());
            vo.setRatingCount(book.getRatingCount());
            vo.setCreatedAt(book.getCreatedAt());
            return vo;
        }).collect(Collectors.toList());
        return Result.success(voList);
    }

    @GetMapping("/borrows")
    public Result<List<BorrowRecordVO>> getAllBorrows() {
        List<BorrowRecord> records = borrowRecordMapper.selectList(null);
        List<BorrowRecordVO> voList = records.stream().map(record -> {
            BorrowRecordVO vo = new BorrowRecordVO();
            vo.setId(record.getId());
            vo.setUserId(record.getUserId());
            vo.setBookId(record.getBookId());
            vo.setBorrowDate(record.getBorrowDate());
            vo.setDueDate(record.getDueDate());
            vo.setReturnDate(record.getReturnDate());
            vo.setStatus(record.getStatus());
            vo.setRenewCount(record.getRenewCount());

            User user = userMapper.selectById(record.getUserId());
            if (user != null) {
                vo.setUsername(user.getUsername());
            }

            Book book = bookMapper.selectById(record.getBookId());
            if (book != null) {
                vo.setBookTitle(book.getTitle());
                vo.setBookCover(book.getCoverUrl());
            }

            return vo;
        }).collect(Collectors.toList());
        return Result.success(voList);
    }

    @GetMapping("/statistics")
    public Result<StatisticsVO> getStatistics() {
        StatisticsVO vo = new StatisticsVO();

        vo.setTotalBooks(bookMapper.selectCount(null));
        vo.setTotalUsers(userMapper.selectCount(null));
        vo.setTotalBorrows(borrowRecordMapper.selectCount(null));

        vo.setCurrentBorrows(borrowRecordMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<BorrowRecord>()
                .eq(BorrowRecord::getStatus, "borrowed")
        ));

        vo.setOverdueBorrows(borrowRecordMapper.selectCount(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<BorrowRecord>()
                .eq(BorrowRecord::getStatus, "overdue")
        ));

        List<Book> books = bookMapper.selectList(null);
        if (!books.isEmpty()) {
            BigDecimal totalRating = books.stream()
                .map(Book::getRating)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            vo.setAverageRating(totalRating.divide(BigDecimal.valueOf(books.size()), 1, BigDecimal.ROUND_HALF_UP));
        } else {
            vo.setAverageRating(BigDecimal.ZERO);
        }

        return Result.success(vo);
    }
}