package com.taskflow.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

    private static final long EXPIRACION_MS = 1000L * 60 * 60 * 24;

    private final Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);

    public String generarToken(String correo) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + EXPIRACION_MS);

        return Jwts.builder()
                .subject(correo)
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(key)
                .compact();
    }

    public String extraerCorreo(String token) {
        return parsearClaims(token).getSubject();
    }

    public boolean esTokenValido(String token) {
        try {
            Claims claims = parsearClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims parsearClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
