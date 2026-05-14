package com.library.controller;

import com.library.common.Result;
import com.library.dto.BorrowDTO;
import com.library.service.BorrowService;
import com.library.vo.BorrowRecordVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    @Autowired
    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @GetMapping("/my")
    public Result<IPage<BorrowRecordVO>> getMyBorrows(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String status) {
        IPage<BorrowRecordVO> result = borrowService.getMyBorrows(page, size, status);
        return Result.success(result);
    }

    @PostMapping
    public Result<Void> borrowBook(@RequestBody BorrowDTO borrowDTO) {
        borrowService.borrowBook(borrowDTO);
        return Result.success(null);
    }

    @PutMapping("/{id}/return")
    public Result<Void> returnBook(@PathVariable Long id) {
        borrowService.returnBook(id);
        return Result.success(null);
    }

    @PutMapping("/{id}/renew")
    public Result<Void> renewBook(@PathVariable Long id) {
        borrowService.renewBook(id);
        return Result.success(null);
    }
}