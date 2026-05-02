package com.project2.demo.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping
public class HelloController {
    @GetMapping
    public String getMethodName() {
        return "Hello anh elm nha";
    }
    
    
}
