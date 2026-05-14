package com.library.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.BookDTO;
import com.library.entity.Book;
import com.library.entity.User;
import com.library.exception.BusinessException;
import com.library.mapper.BookMapper;
import com.library.mapper.UserMapper;
import com.library.service.BookService;
import com.library.utils.JwtUtil;
import com.library.vo.BookVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class BookServiceImpl implements BookService {

    private final BookMapper bookMapper;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    public BookServiceImpl(BookMapper bookMapper, UserMapper userMapper, JwtUtil jwtUtil) {
        this.bookMapper = bookMapper;
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public IPage<BookVO> getBookPage(Integer page, Integer size, String category, String keyword) {
        Page<Book> pageParam = new Page<>(page, size);
        Long userId = jwtUtil.getUserIdFromToken();

        IPage<Book> bookPage = bookMapper.selectBookPage(pageParam, category, keyword, userId);

        return bookPage.convert(this::convertToBookVO);
    }

    @Override
    public BookVO getBookById(Long id) {
        Book book = bookMapper.selectById(id);
        if (book == null) {
            throw new BusinessException("图书不存在");
        }
        return convertToBookVO(book);
    }

    @Override
    @Transactional
    public void addBook(BookDTO bookDTO) {
        Book book = new Book();
        BeanUtil.copyProperties(bookDTO, book);
        book.setUserId(jwtUtil.getUserIdFromToken());
        book.setRating(java.math.BigDecimal.ZERO);
        book.setRatingCount(0);

        bookMapper.insert(book);
    }

    @Override
    @Transactional
    public void updateBook(Long id, BookDTO bookDTO) {
        Book book = getBookOrThrow(id);
        validateOwnership(book);

        BeanUtil.copyProperties(bookDTO, book, "id", "userId", "rating", "ratingCount");
        bookMapper.updateById(book);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = getBookOrThrow(id);
        validateOwnership(book);

        bookMapper.deleteById(id);
    }

    private Book getBookOrThrow(Long id) {
        Book book = bookMapper.selectById(id);
        if (book == null) {
            throw new BusinessException("图书不存在");
        }
        return book;
    }

    private void validateOwnership(Book book) {
        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!book.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限操作此图书");
        }
    }

    private BookVO convertToBookVO(Book book) {
        BookVO vo = new BookVO();
        BeanUtil.copyProperties(book, vo);

        if (book.getUserId() != null) {
            User user = userMapper.selectById(book.getUserId());
            if (user != null) {
                vo.setUsername(user.getUsername());
            }
        }
        return vo;
    }
}
