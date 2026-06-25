package com.taskflow.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskflow.dto.EstadisticasDTO;
import com.taskflow.dto.TareaDTO;
import com.taskflow.entity.Categoria;
import com.taskflow.entity.Tarea;
import com.taskflow.entity.Usuario;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.CategoriaRepository;
import com.taskflow.repository.TareaRepository;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<TareaDTO> listar(Long usuarioId, String estado, Long categoriaId) {
        List<Tarea> tareas;

        if (estado != null) {
            tareas = tareaRepository.findByUsuarioIdAndEstado(usuarioId, estado);
        } else if (categoriaId != null) {
            tareas = tareaRepository.findByUsuarioIdAndCategoriaId(usuarioId, categoriaId);
        } else {
            tareas = tareaRepository.findByUsuarioId(usuarioId);
        }

        return tareas.stream().map(this::convertirADTO).toList();
    }

    public TareaDTO crear(String titulo, String descripcion, String estado, String prioridad,
            LocalDateTime fechaVencimiento, Long categoriaId, Usuario usuario) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(titulo);
        tarea.setDescripcion(descripcion);
        tarea.setEstado(estado);
        tarea.setPrioridad(prioridad);
        tarea.setFechaCreacion(LocalDateTime.now());
        tarea.setFechaVencimiento(fechaVencimiento);
        tarea.setUsuario(usuario);
        tarea.setCategoria(obtenerCategoria(categoriaId, usuario.getId()));

        return convertirADTO(tareaRepository.save(tarea));
    }

    public TareaDTO actualizar(Long id, String titulo, String descripcion, String estado, String prioridad,
            LocalDateTime fechaVencimiento, Long categoriaId, Long usuarioId) {
        Tarea tarea = obtenerPropia(id, usuarioId);
        tarea.setTitulo(titulo);
        tarea.setDescripcion(descripcion);
        tarea.setEstado(estado);
        tarea.setPrioridad(prioridad);
        tarea.setFechaVencimiento(fechaVencimiento);
        tarea.setCategoria(obtenerCategoria(categoriaId, usuarioId));

        return convertirADTO(tareaRepository.save(tarea));
    }

    public TareaDTO actualizarEstado(Long id, String estado, Long usuarioId) {
        Tarea tarea = obtenerPropia(id, usuarioId);
        tarea.setEstado(estado);

        return convertirADTO(tareaRepository.save(tarea));
    }

    public EstadisticasDTO obtenerEstadisticas(Long usuarioId) {
        List<Tarea> tareas = tareaRepository.findByUsuarioId(usuarioId);

        long pendientes = tareas.stream().filter(t -> "PENDIENTE".equals(t.getEstado())).count();
        long enProgreso = tareas.stream().filter(t -> "EN_PROGRESO".equals(t.getEstado())).count();
        long finalizadas = tareas.stream().filter(t -> "FINALIZADA".equals(t.getEstado())).count();

        return new EstadisticasDTO(tareas.size(), pendientes, enProgreso, finalizadas);
    }

    public void eliminar(Long id, Long usuarioId) {
        tareaRepository.delete(obtenerPropia(id, usuarioId));
    }

    private Categoria obtenerCategoria(Long categoriaId, Long usuarioId) {
        if (categoriaId == null) {
            return null;
        }

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Categoría no encontrada");
        }

        return categoria;
    }

    private Tarea obtenerPropia(Long id, Long usuarioId) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        if (!tarea.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Tarea no encontrada");
        }

        return tarea;
    }

    private TareaDTO convertirADTO(Tarea tarea) {
        Categoria categoria = tarea.getCategoria();

        return new TareaDTO(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getDescripcion(),
                tarea.getEstado(),
                tarea.getPrioridad(),
                tarea.getFechaCreacion(),
                tarea.getFechaVencimiento(),
                categoria != null ? categoria.getId() : null,
                categoria != null ? categoria.getNombre() : null);
    }
}
