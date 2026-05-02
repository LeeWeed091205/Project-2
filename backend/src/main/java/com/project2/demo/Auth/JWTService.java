package com.project2.demo.Auth;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService{

    @Value("${jwt.secret_key}")
    private String SECRET_KEY;

    @Value("${jwt.expired_time}")
    private Long EXPIRED_TIME;


    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }


    public String generateToken(UserDetails userDetails){
        return Jwts.builder()
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRED_TIME))
                    .signWith(getSignInKey(),SignatureAlgorithm.HS256)
                    .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    public boolean isTokenExpired(String Token){
        return (extractClaim(Token, Claims::getExpiration).before(new Date()));
    }


    //Claim ở đây có thể coi như những dòng chữ trên jwt token, hay đơn giản hơn là các cặp key-value được mã hóa trong token,
    //ví dụ như "sub": "username", "exp": "expiration time", "roles": "user roles" v.v... Tùy vào cách bạn thiết kế token mà claim có thể khác nhau
private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder() // Khởi tạo một xưởng chế tạo "parser" để phân tích cú pháp JWT token
        .setSigningKey(getSignInKey()) // Hành động cấp quyền, nhét khóa bí mật đã được mã hóa vào parser này
        .build() // Chốt lại, tạo 1 parser hoàn chỉnh
        .parseClaimsJws(token) // Nhét chuỗi token mà user gửi vào parser để phân tích
        .getBody(); // Nếu vượt qua hết kiểm tra, bóc tách phần "body" của token, là phần Payload 
    return claimsResolver.apply(claims); // Áp dụng để lấy ra claim cụ thể mà ta mong muốn như username, expiration time,..
}

    private Key getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY); 
        return Keys.hmacShaKeyFor(keyBytes);  // Chuyển đổi chuỗi secret_key thành một đối tượng Key có thể sử dụng để ký và xác nhận JWT Token

    }

}
