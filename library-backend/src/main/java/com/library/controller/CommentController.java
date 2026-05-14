package com.library.controller;

import com.library.common.Result;
import com.library.dto.CommentDTO;
import com.library.service.CommentService;
import com.library.vo.CommentVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/book/{bookId}")
    public Result<IPage<CommentVO>> getBookComments(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<CommentVO> result = commentService.getBookComments(bookId, page, size);
        return Result.success(result);
    }

    @PostMapping
    public Result<Void> addComment(@RequestBody CommentDTO commentDTO) {
        commentService.addComment(commentDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return Result.success(null);
    }
}