package com.library.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.entity.BorrowRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BorrowRecordMapper extends BaseMapper<BorrowRecord> {
    
    IPage<BorrowRecord> selectBorrowRecordPage(Page<?> page, @Param("userId") Long userId, 
                                               @Param("status") String status);
}
