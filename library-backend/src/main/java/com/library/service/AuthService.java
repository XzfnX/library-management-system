package com.library.service;

import com.library.dto.LoginDTO;
import com.library.dto.RegisterDTO;
import com.library.vo.UserVO;

public interface AuthService {
    
    String login(LoginDTO loginDTO);
    
    void register(RegisterDTO registerDTO);
    
    UserVO getCurrentUser();
}
