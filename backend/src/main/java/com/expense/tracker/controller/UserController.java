package com.expense.tracker.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.tracker.model.User;
import com.expense.tracker.repository.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= UPDATE USER =================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody User user) {

        User existing = userRepository.findById(id)
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        existing.setName(user.getName());
        existing.setUsername(user.getUsername());
        existing.setEmail(user.getEmail());
        existing.setProfileImage(user.getProfileImage());

        User updated = userRepository.save(existing);

        return ResponseEntity.ok(updated);
    }

    // ================= DELETE USER (CORRECTED) =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        // Just delete user
        // Expenses will be deleted automatically because of cascade
        userRepository.delete(user);

        return ResponseEntity.ok("User deleted successfully");
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest()
                    .body("Incorrect current password");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}