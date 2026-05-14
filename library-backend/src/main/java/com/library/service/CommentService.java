package com.library.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.library.dto.CommentDTO;
import com.library.vo.CommentVO;

public interface CommentService {
    
    IPage<CommentVO> getBookComments(Long bookId, Integer page, Integer size);
    
    void addComment(CommentDTO commentDTO);
    
    void deleteComment(Long id);
}
