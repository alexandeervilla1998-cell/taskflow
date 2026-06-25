package com.taskflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.EstadoRequest;
import com.taskflow.dto.ResponseDTO;
import com.taskflow.dto.TareaDTO;
import com.taskflow.dto.TareaRequest;
import com.taskflow.entity.Usuario;
import com.taskflow.service.TareaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @GetMapping
    public ResponseEntity<ResponseDTO<List<TareaDTO>>> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Long categoriaId,
            @AuthenticationPrincipal Usuario usuario) {
        List<TareaDTO> tareas = tareaService.listar(usuario.getId(), estado, categoriaId);
        return ResponseEntity.ok(ResponseDTO.exito(tareas, null));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<TareaDTO>> crear(@Valid @RequestBody TareaRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        TareaDTO tarea = tareaService.crear(request.getTitulo(), request.getDescripcion(), request.getEstado(),
                request.getPrioridad(), request.getFechaVencimiento(), request.getCategoriaId(), usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.exito(tarea, "Tarea creada correctamente"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<TareaDTO>> actualizar(@PathVariable Long id,
            @Valid @RequestBody TareaRequest request, @AuthenticationPrincipal Usuario usuario) {
        TareaDTO tarea = tareaService.actualizar(id, request.getTitulo(), request.getDescripcion(),
                request.getEstado(), request.getPrioridad(), request.getFechaVencimiento(),
                request.getCategoriaId(), usuario.getId());
        return ResponseEntity.ok(ResponseDTO.exito(tarea, "Tarea actualizada correctamente"));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ResponseDTO<TareaDTO>> actualizarEstado(@PathVariable Long id,
            @Valid @RequestBody EstadoRequest request, @AuthenticationPrincipal Usuario usuario) {
        TareaDTO tarea = tareaService.actualizarEstado(id, request.getEstado(), usuario.getId());
        return ResponseEntity.ok(ResponseDTO.exito(tarea, "Estado actualizado correctamente"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Object>> eliminar(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        tareaService.eliminar(id, usuario.getId());
        return ResponseEntity.ok(ResponseDTO.exito(null, "Tarea eliminada correctamente"));
    }
}
