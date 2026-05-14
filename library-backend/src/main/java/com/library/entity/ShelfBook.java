package com.library.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.time.LocalDateTime;

@TableName("shelf_book")
public class ShelfBook {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long shelfId;
    
    private Long bookId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getShelfId() {
        return shelfId;
    }
    
    public void setShelfId(Long shelfId) {
        this.shelfId = shelfId;
    }
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
