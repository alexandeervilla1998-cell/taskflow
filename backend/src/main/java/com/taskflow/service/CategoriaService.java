package com.taskflow.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskflow.dto.CategoriaDTO;
import com.taskflow.entity.Categoria;
import com.taskflow.entity.Usuario;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> listarPorUsuario(Long usuarioId) {
        return categoriaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertirADTO)
                .toList();
    }

    public CategoriaDTO crear(String nombre, String color, Usuario usuario) {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setColor(color);
        categoria.setUsuario(usuario);

        return convertirADTO(categoriaRepository.save(categoria));
    }

    public CategoriaDTO actualizar(Long id, String nombre, String color, Long usuarioId) {
        Categoria categoria = obtenerPropia(id, usuarioId);
        categoria.setNombre(nombre);
        categoria.setColor(color);

        return convertirADTO(categoriaRepository.save(categoria));
    }

    public void eliminar(Long id, Long usuarioId) {
        Categoria categoria = obtenerPropia(id, usuarioId);
        categoriaRepository.delete(categoria);
    }

    private Categoria obtenerPropia(Long id, Long usuarioId) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Categoría no encontrada");
        }

        return categoria;
    }

    private CategoriaDTO convertirADTO(Categoria categoria) {
        return new CategoriaDTO(categoria.getId(), categoria.getNombre(), categoria.getColor());
    }
}
