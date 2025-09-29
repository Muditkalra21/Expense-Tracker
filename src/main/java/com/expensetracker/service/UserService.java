// package com.expensetracker.service;

// import com.expensetracker.dto.AuthRequest;
// import com.expensetracker.dto.AuthResponse;
// import com.expensetracker.dto.UserDto;
// import com.expensetracker.entity.User;
// import com.expensetracker.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import java.util.Optional;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Autowired
//     private JwtService jwtService;

//     public AuthResponse register(UserDto userDto) {
//         if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
//             throw new RuntimeException("Username already exists");
//         }

//         User user = new User();
//         user.setUsername(userDto.getUsername());
//         user.setPassword(passwordEncoder.encode(userDto.getPassword()));
//         user.setEmail(userDto.getEmail());

//         user = userRepository.save(user);

//         String token = jwtService.generateToken(user.getUsername());
//         return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
//     }

//     public AuthResponse login(AuthRequest authRequest) {
//         Optional<User> userOpt = userRepository.findByUsername(authRequest.getUsername());
//         if (userOpt.isPresent() && passwordEncoder.matches(authRequest.getPassword(), userOpt.get().getPassword())) {
//             User user = userOpt.get();
//             String token = jwtService.generateToken(user.getUsername());
//             return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
//         }
//         throw new RuntimeException("Invalid credentials");
//     }

//     public UserDto getUserById(Long id) {
//         User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//         return convertToDto(user);
//     }

//     public UserDto updateUser(Long id, UserDto userDto) {
//         User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//         user.setEmail(userDto.getEmail());
//         userRepository.save(user);
//         return convertToDto(user);
//     }

//     public void deleteUser(Long id) {
//         userRepository.deleteById(id);
//     }

//     private UserDto convertToDto(User user) {
//         UserDto dto = new UserDto();
//         dto.setId(user.getId());
//         dto.setUsername(user.getUsername());
//         dto.setEmail(user.getEmail());
//         return dto;
//     }
// }
package com.expensetracker.service;

import com.expensetracker.dto.AuthRequest;
import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.UserDto;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(UserDto userDto) {
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }

    public AuthResponse login(AuthRequest authRequest) {
        Optional<User> userOpt = userRepository.findByUsername(authRequest.getUsername());
        if (userOpt.isPresent() && passwordEncoder.matches(authRequest.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            String token = jwtService.generateToken(user.getUsername());
            return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
        }
        throw new RuntimeException("Invalid credentials");
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(userDto.getEmail());
        userRepository.save(user);
        return convertToDto(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }
}