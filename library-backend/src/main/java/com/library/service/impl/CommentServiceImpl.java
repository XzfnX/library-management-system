package com.library.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.dto.CommentDTO;
import com.library.entity.Comment;
import com.library.entity.User;
import com.library.exception.BusinessException;
import com.library.mapper.CommentMapper;
import com.library.mapper.UserMapper;
import com.library.service.CommentService;
import com.library.utils.JwtUtil;
import com.library.vo.CommentVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    public CommentServiceImpl(CommentMapper commentMapper, UserMapper userMapper, JwtUtil jwtUtil) {
        this.commentMapper = commentMapper;
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public IPage<CommentVO> getBookComments(Long bookId, Integer page, Integer size) {
        Page<Comment> pageParam = new Page<>(page, size);
        IPage<Comment> commentPage = commentMapper.selectCommentPage(pageParam, bookId);

        return commentPage.convert(comment -> {
            CommentVO vo = new CommentVO();
            BeanUtil.copyProperties(comment, vo);

            User user = userMapper.selectById(comment.getUserId());
            if (user != null) {
                vo.setUsername(user.getUsername());
                vo.setUserAvatar(user.getAvatar());
            }

            return vo;
        });
    }

    @Override
    @Transactional
    public void addComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        BeanUtil.copyProperties(commentDTO, comment);
        comment.setUserId(jwtUtil.getUserIdFromToken());

        commentMapper.insert(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentMapper.selectById(id);
        if (comment == null) {
            throw new BusinessException("评论不存在");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!comment.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限删除此评论");
        }

        commentMapper.deleteById(id);
    }
}
