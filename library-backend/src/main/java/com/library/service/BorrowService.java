package com.library.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.library.dto.BorrowDTO;
import com.library.vo.BorrowRecordVO;

public interface BorrowService {
    
    IPage<BorrowRecordVO> getMyBorrows(Integer page, Integer size, String status);
    
    void borrowBook(BorrowDTO borrowDTO);
    
    void returnBook(Long id);
    
    void renewBook(Long id);
}
