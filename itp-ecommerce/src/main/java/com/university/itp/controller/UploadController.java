package com.university.itp.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @PostMapping(value = "/stl", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadStl(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "message", required = false) String message
    ) throws IOException {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No file uploaded"));
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        if (!originalName.toLowerCase().endsWith(".stl")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only .stl files are allowed"));
        }

        Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "ceylon3d-uploads");
        Files.createDirectories(uploadDir);

        String storedFileName = UUID.randomUUID() + "-" + originalName;
        Path targetPath = uploadDir.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok(Map.of(
                "message", "Upload successful",
                "fileName", storedFileName,
                "name", name == null ? "" : name,
                "email", email == null ? "" : email,
                "phone", phone == null ? "" : phone,
                "messageText", message == null ? "" : message
        ));
    }
}
