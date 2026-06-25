package com.taskflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskflow.entity.Tarea;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    List<Tarea> findByUsuarioId(Long usuarioId);

    List<Tarea> findByUsuarioIdAndEstado(Long usuarioId, String estado);

    List<Tarea> findByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);
}
