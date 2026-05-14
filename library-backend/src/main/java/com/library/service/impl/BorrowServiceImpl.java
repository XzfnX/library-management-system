package com.library.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.BorrowDTO;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.exception.BusinessException;
import com.library.mapper.BookMapper;
import com.library.mapper.BorrowRecordMapper;
import com.library.mapper.UserMapper;
import com.library.service.BorrowService;
import com.library.utils.JwtUtil;
import com.library.vo.BorrowRecordVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordMapper borrowRecordMapper;
    private final BookMapper bookMapper;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    public BorrowServiceImpl(BorrowRecordMapper borrowRecordMapper, BookMapper bookMapper, UserMapper userMapper, JwtUtil jwtUtil) {
        this.borrowRecordMapper = borrowRecordMapper;
        this.bookMapper = bookMapper;
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public IPage<BorrowRecordVO> getMyBorrows(Integer page, Integer size, String status) {
        Long userId = jwtUtil.getUserIdFromToken();
        Page<BorrowRecord> pageParam = new Page<>(page, size);

        IPage<BorrowRecord> borrowPage = borrowRecordMapper.selectBorrowRecordPage(pageParam, userId, status);

        return borrowPage.convert(this::convertToVO);
    }

    @Override
    @Transactional
    public void borrowBook(BorrowDTO borrowDTO) {
        Long userId = jwtUtil.getUserIdFromToken();

        Book book = bookMapper.selectById(borrowDTO.getBookId());
        if (book == null) {
            throw new BusinessException("图书不存在");
        }

        if (book.getStock() <= 0) {
            throw new BusinessException("图书库存不足");
        }

        BorrowRecord existRecord = borrowRecordMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<BorrowRecord>()
                .eq(BorrowRecord::getUserId, userId)
                .eq(BorrowRecord::getBookId, borrowDTO.getBookId())
                .eq(BorrowRecord::getStatus, "borrowed")
        );

        if (existRecord != null) {
            throw new BusinessException("您已借阅此书，请先归还");
        }

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUserId(userId);
        borrowRecord.setBookId(borrowDTO.getBookId());
        borrowRecord.setBorrowDate(LocalDateTime.now());
        borrowRecord.setDueDate(borrowDTO.getDueDate() != null ?
            borrowDTO.getDueDate() :
            LocalDateTime.now().plusDays(borrowDTO.getBorrowDays() != null ? borrowDTO.getBorrowDays() : 30));
        borrowRecord.setStatus("borrowed");
        borrowRecord.setRenewCount(0);

        borrowRecordMapper.insert(borrowRecord);

        book.setStock(book.getStock() - 1);
        bookMapper.updateById(book);
    }

    @Override
    @Transactional
    public void returnBook(Long id) {
        BorrowRecord record = borrowRecordMapper.selectById(id);
        if (record == null) {
            throw new BusinessException("借阅记录不存在");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!record.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限操作此借阅记录");
        }

        if (!"borrowed".equals(record.getStatus())) {
            throw new BusinessException("该图书已归还");
        }

        record.setReturnDate(LocalDateTime.now());
        record.setStatus("returned");

        borrowRecordMapper.updateById(record);

        Book book = bookMapper.selectById(record.getBookId());
        if (book != null) {
            book.setStock(book.getStock() + 1);
            bookMapper.updateById(book);
        }
    }

    @Override
    @Transactional
    public void renewBook(Long id) {
        BorrowRecord record = borrowRecordMapper.selectById(id);
        if (record == null) {
            throw new BusinessException("借阅记录不存在");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!record.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限操作此借阅记录");
        }

        if (!"borrowed".equals(record.getStatus())) {
            throw new BusinessException("该图书已归还，无法续借");
        }

        if (record.getRenewCount() >= 2) {
            throw new BusinessException("已达到最大续借次数");
        }

        record.setDueDate(record.getDueDate().plusDays(15));
        record.setRenewCount(record.getRenewCount() + 1);

        borrowRecordMapper.updateById(record);
    }

    private BorrowRecordVO convertToVO(BorrowRecord record) {
        BorrowRecordVO vo = new BorrowRecordVO();
        BeanUtil.copyProperties(record, vo);

        Book book = bookMapper.selectById(record.getBookId());
        if (book != null) {
            vo.setBookTitle(book.getTitle());
            vo.setBookCover(book.getCoverUrl());
        }

        User user = userMapper.selectById(record.getUserId());
        if (user != null) {
            vo.setUsername(user.getUsername());
        }

        return vo;
    }
}
