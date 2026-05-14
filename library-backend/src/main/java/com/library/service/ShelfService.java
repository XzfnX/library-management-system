package com.library.service;

import com.library.dto.ShelfDTO;
import com.library.entity.Shelf;

import java.util.List;

public interface ShelfService {
    
    List<Shelf> getMyShelves();
    
    void addShelf(ShelfDTO shelfDTO);
    
    void updateShelf(Long id, ShelfDTO shelfDTO);
    
    void deleteShelf(Long id);
    
    void addBookToShelf(Long shelfId, Long bookId);
    
    void removeBookFromShelf(Long shelfId, Long bookId);
}
