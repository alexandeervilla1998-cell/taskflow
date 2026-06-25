package com.taskflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.CategoriaDTO;
import com.taskflow.dto.CategoriaRequest;
import com.taskflow.dto.ResponseDTO;
import com.taskflow.entity.Usuario;
import com.taskflow.service.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<ResponseDTO<List<CategoriaDTO>>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(ResponseDTO.exito(categoriaService.listarPorUsuario(usuario.getId()), null));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<CategoriaDTO>> crear(@Valid @RequestBody CategoriaRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        CategoriaDTO categoria = categoriaService.crear(request.getNombre(), request.getColor(), usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.exito(categoria, "Categoría creada correctamente"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<CategoriaDTO>> actualizar(@PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request, @AuthenticationPrincipal Usuario usuario) {
        CategoriaDTO categoria = categoriaService.actualizar(id, request.getNombre(), request.getColor(),
                usuario.getId());
        return ResponseEntity.ok(ResponseDTO.exito(categoria, "Categoría actualizada correctamente"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Object>> eliminar(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        categoriaService.eliminar(id, usuario.getId());
        return ResponseEntity.ok(ResponseDTO.exito(null, "Categoría eliminada correctamente"));
    }
}
