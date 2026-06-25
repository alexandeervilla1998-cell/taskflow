package com.taskflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegistroRequest;
import com.taskflow.dto.ResponseDTO;
import com.taskflow.entity.Usuario;
import com.taskflow.security.JwtService;
import com.taskflow.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/registro")
    public ResponseEntity<ResponseDTO<AuthResponse>> registro(@Valid @RequestBody RegistroRequest request) {
        Usuario usuario = usuarioService.registrar(request.getNombre(), request.getCorreo(),
                request.getContrasena());

        String token = jwtService.generarToken(usuario.getCorreo());
        AuthResponse respuesta = new AuthResponse(token, usuarioService.convertirADTO(usuario));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.exito(respuesta, "Usuario registrado correctamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.buscarPorCorreo(request.getCorreo());

        if (!usuarioService.validarContrasena(usuario, request.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.error("Credenciales inválidas"));
        }

        String token = jwtService.generarToken(usuario.getCorreo());
        AuthResponse respuesta = new AuthResponse(token, usuarioService.convertirADTO(usuario));

        return ResponseEntity.ok(ResponseDTO.exito(respuesta, "Inicio de sesión exitoso"));
    }
}
