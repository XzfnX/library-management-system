package com.library.controller;

import com.library.common.Result;
import com.library.dto.ShelfDTO;
import com.library.entity.Shelf;
import com.library.service.ShelfService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/shelves")
public class ShelfController {

    private final ShelfService shelfService;

    @Autowired
    public ShelfController(ShelfService shelfService) {
        this.shelfService = shelfService;
    }

    @GetMapping
    public Result<List<Shelf>> getMyShelves() {
        List<Shelf> shelves = shelfService.getMyShelves();
        return Result.success(shelves);
    }

    @PostMapping
    public Result<Void> addShelf(@Valid @RequestBody ShelfDTO shelfDTO) {
        shelfService.addShelf(shelfDTO);
        return Result.success(null);
    }

    @PutMapping("/{id}")
    public Result<Void> updateShelf(@PathVariable Long id, @Valid @RequestBody ShelfDTO shelfDTO) {
        shelfService.updateShelf(id, shelfDTO);
        return Result.success(null);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteShelf(@PathVariable Long id) {
        shelfService.deleteShelf(id);
        return Result.success(null);
    }

    @PostMapping("/{shelfId}/books/{bookId}")
    public Result<Void> addBookToShelf(
            @PathVariable Long shelfId,
            @PathVariable Long bookId) {
        shelfService.addBookToShelf(shelfId, bookId);
        return Result.success(null);
    }

    @DeleteMapping("/{shelfId}/books/{bookId}")
    public Result<Void> removeBookFromShelf(
            @PathVariable Long shelfId,
            @PathVariable Long bookId) {
        shelfService.removeBookFromShelf(shelfId, bookId);
        return Result.success(null);
    }
}