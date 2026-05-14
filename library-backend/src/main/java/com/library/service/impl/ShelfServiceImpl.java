package com.library.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.library.dto.ShelfDTO;
import com.library.entity.Shelf;
import com.library.entity.ShelfBook;
import com.library.exception.BusinessException;
import com.library.mapper.ShelfBookMapper;
import com.library.mapper.ShelfMapper;
import com.library.service.ShelfService;
import com.library.utils.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ShelfServiceImpl implements ShelfService {

    private final ShelfMapper shelfMapper;
    private final ShelfBookMapper shelfBookMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    public ShelfServiceImpl(ShelfMapper shelfMapper, ShelfBookMapper shelfBookMapper, JwtUtil jwtUtil) {
        this.shelfMapper = shelfMapper;
        this.shelfBookMapper = shelfBookMapper;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public List<Shelf> getMyShelves() {
        Long userId = jwtUtil.getUserIdFromToken();
        return shelfMapper.selectList(
            new LambdaQueryWrapper<Shelf>()
                .eq(Shelf::getUserId, userId)
                .orderByAsc(Shelf::getSortOrder)
        );
    }

    @Override
    @Transactional
    public void addShelf(ShelfDTO shelfDTO) {
        Shelf shelf = new Shelf();
        BeanUtil.copyProperties(shelfDTO, shelf);
        shelf.setUserId(jwtUtil.getUserIdFromToken());
        shelf.setIsDefault(0);

        shelfMapper.insert(shelf);
    }

    @Override
    @Transactional
    public void updateShelf(Long id, ShelfDTO shelfDTO) {
        Shelf shelf = shelfMapper.selectById(id);
        if (shelf == null) {
            throw new BusinessException("书架不存在");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!shelf.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限修改此书架");
        }

        BeanUtil.copyProperties(shelfDTO, shelf, "id", "userId");
        shelfMapper.updateById(shelf);
    }

    @Override
    @Transactional
    public void deleteShelf(Long id) {
        Shelf shelf = shelfMapper.selectById(id);
        if (shelf == null) {
            throw new BusinessException("书架不存在");
        }

        if (shelf.getIsDefault() == 1) {
            throw new BusinessException("默认书架不能删除");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!shelf.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限删除此书架");
        }

        shelfMapper.deleteById(id);

        shelfBookMapper.delete(new LambdaQueryWrapper<ShelfBook>().eq(ShelfBook::getShelfId, id));
    }

    @Override
    @Transactional
    public void addBookToShelf(Long shelfId, Long bookId) {
        Shelf shelf = shelfMapper.selectById(shelfId);
        if (shelf == null) {
            throw new BusinessException("书架不存在");
        }

        Long currentUserId = jwtUtil.getUserIdFromToken();
        if (!shelf.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权限操作此书架");
        }

        ShelfBook exist = shelfBookMapper.selectOne(
            new LambdaQueryWrapper<ShelfBook>()
                .eq(ShelfBook::getShelfId, shelfId)
                .eq(ShelfBook::getBookId, bookId)
        );

        if (exist != null) {
            throw new BusinessException("图书已在书架中");
        }

        ShelfBook shelfBook = new ShelfBook();
        shelfBook.setShelfId(shelfId);
        shelfBook.setBookId(bookId);

        shelfBookMapper.insert(shelfBook);
    }

    @Override
    @Transactional
    public void removeBookFromShelf(Long shelfId, Long bookId) {
        shelfBookMapper.delete(
            new LambdaQueryWrapper<ShelfBook>()
                .eq(ShelfBook::getShelfId, shelfId)
                .eq(ShelfBook::getBookId, bookId)
        );
    }
}
