package com.library.controller;

import com.library.common.Result;
import com.library.dto.BookDTO;
import com.library.service.BookService;
import com.library.vo.BookVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public Result<IPage<BookVO>> getBookList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        IPage<BookVO> result = bookService.getBookPage(page, size, category, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<BookVO> getBookDetail(@PathVariable Long id) {
        BookVO book = bookService.getBookById(id);
        return Result.success(book);
    }

    @PostMapping
    public Result<Void> addBook(@Valid @RequestBody BookDTO bookDTO) {
        bookService.addBook(bookDTO);
        return Result.success(null);
    }

    @PutMapping("/{id}")
    public Result<Void> updateBook(@PathVariable Long id, @Valid @RequestBody BookDTO bookDTO) {
        bookService.updateBook(id, bookDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return Result.success(null);
    }
}