package com.library.controller;

import com.library.common.Result;
import com.library.entity.Category;
import com.library.mapper.CategoryMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryMapper categoryMapper;

    @Autowired
    public CategoryController(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @GetMapping
    public Result<List<Category>> getAllCategories() {
        List<Category> categories = categoryMapper.selectList(null);
        return Result.success(categories);
    }
}