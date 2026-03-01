package com.university.itp.dto;

import com.university.itp.model.Role;
import com.university.itp.model.User;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private Set<Role> roles;

    public static UserDTO from(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRoles(user.getRoles());
        return dto;
    }
}
