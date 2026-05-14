package com.library.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.library.dto.BookDTO;
import com.library.vo.BookVO;

public interface BookService {
    
    IPage<BookVO> getBookPage(Integer page, Integer size, String category, String keyword);
    
    BookVO getBookById(Long id);
    
    void addBook(BookDTO bookDTO);
    
    void updateBook(Long id, BookDTO bookDTO);
    
    void deleteBook(Long id);
}
