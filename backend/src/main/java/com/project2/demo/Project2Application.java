package com.project2.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class Project2Application {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
        .ignoreIfMissing()
        .load();

		System.setProperty("CLOUDINARY_NAME", dotenv.get("CLOUDINARY_NAME"));
		System.setProperty("CLOUDINARY_KEY", dotenv.get("CLOUDINARY_KEY"));
		System.setProperty("CLOUDINARY_SECRET", dotenv.get("CLOUDINARY_SECRET"));
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
		System.setProperty("JWT_EXPIRATION", dotenv.get("JWT_EXPIRATION"));
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		SpringApplication.run(Project2Application.class, args);
	}

}
