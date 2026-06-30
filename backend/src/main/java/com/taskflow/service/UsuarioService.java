package com.taskflow.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskflow.dto.UsuarioDTO;
import com.taskflow.entity.Rol;
import com.taskflow.entity.Usuario;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.RolRepository;
import com.taskflow.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrar(String nombre, String correo, String contrasena) {
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Rol rolUsuario = rolRepository.findByNombre("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Rol USER no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(contrasena));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setRol(rolUsuario);

        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    public boolean validarContrasena(Usuario usuario, String contrasena) {
        return passwordEncoder.matches(contrasena, usuario.getContrasena());
    }

    public UsuarioDTO actualizarPerfil(Usuario usuario, String nombre, String fotoPerfil) {
        usuario.setNombre(nombre);
        usuario.setFotoPerfil(fotoPerfil);
        return convertirADTO(usuarioRepository.save(usuario));
    }

    public void cambiarContrasena(Usuario usuario, String contrasenaActual, String contrasenaNueva) {
        if (!passwordEncoder.matches(contrasenaActual, usuario.getContrasena())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        usuario.setContrasena(passwordEncoder.encode(contrasenaNueva));
        usuarioRepository.save(usuario);
    }

    public UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getFotoPerfil(),
                usuario.getFechaRegistro(),
                usuario.getRol().getNombre());
    }
}
