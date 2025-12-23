package com.alzheimer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AlzheimerBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlzheimerBackendApplication.class, args);
    }
}
