package com.taskflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.ActualizarPerfilRequest;
import com.taskflow.dto.CambiarContrasenaRequest;
import com.taskflow.dto.ResponseDTO;
import com.taskflow.dto.UsuarioDTO;
import com.taskflow.entity.Usuario;
import com.taskflow.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<ResponseDTO<UsuarioDTO>> obtenerPerfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(ResponseDTO.exito(usuarioService.convertirADTO(usuario), "Perfil obtenido"));
    }

    @PutMapping("/perfil")
    public ResponseEntity<ResponseDTO<UsuarioDTO>> actualizarPerfil(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody ActualizarPerfilRequest request) {
        UsuarioDTO dto = usuarioService.actualizarPerfil(usuario, request.getNombre(), request.getFotoPerfil());
        return ResponseEntity.ok(ResponseDTO.exito(dto, "Perfil actualizado correctamente"));
    }

    @PutMapping("/contrasena")
    public ResponseEntity<ResponseDTO<Void>> cambiarContrasena(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CambiarContrasenaRequest request) {
        usuarioService.cambiarContrasena(usuario, request.getContrasenaActual(), request.getContrasenaNueva());
        return ResponseEntity.ok(ResponseDTO.exito(null, "Contraseña actualizada correctamente"));
    }
}
