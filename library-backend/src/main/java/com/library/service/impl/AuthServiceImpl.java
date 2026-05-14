package com.library.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.library.dto.LoginDTO;
import com.library.dto.RegisterDTO;
import com.library.entity.User;
import com.library.exception.BusinessException;
import com.library.mapper.UserMapper;
import com.library.service.AuthService;
import com.library.utils.JwtUtil;
import com.library.vo.UserVO;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String login(LoginDTO loginDTO) {
        User user = null;

        if (StrUtil.isNotBlank(loginDTO.getStudentId()) && StrUtil.isNotBlank(loginDTO.getUsername())) {
            user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                    .eq(User::getPhone, loginDTO.getStudentId())
                    .eq(User::getUsername, loginDTO.getUsername())
                    .eq(User::getRole, 1)
                    .eq(User::getStatus, 1)
            );
        } else if (StrUtil.isNotBlank(loginDTO.getUsername()) && StrUtil.isNotBlank(loginDTO.getPassword())) {
            user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                    .eq(User::getUsername, loginDTO.getUsername())
                    .eq(User::getStatus, 1)
            );

            if (user != null && !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                throw new BusinessException("密码错误");
            }
        }

        if (user == null) {
            throw new BusinessException("用户不存在或已被禁用");
        }

        return jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
    }

    @Override
    public void register(RegisterDTO registerDTO) {
        User existUser = userMapper.selectOne(
            new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername())
        );

        if (existUser != null) {
            throw new BusinessException("用户名已存在");
        }

        if (StrUtil.isNotBlank(registerDTO.getEmail())) {
            User existEmail = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getEmail, registerDTO.getEmail())
            );
            if (existEmail != null) {
                throw new BusinessException("邮箱已被注册");
            }
        }

        User user = new User();
        BeanUtils.copyProperties(registerDTO, user);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole(1);
        user.setStatus(1);

        userMapper.insert(user);
    }

    @Override
    public UserVO getCurrentUser() {
        User user = userMapper.selectById(jwtUtil.getUserIdFromToken());
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }
}
