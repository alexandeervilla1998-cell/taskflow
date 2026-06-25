package com.taskflow.dto;

public class EstadisticasDTO {

    private long total;
    private long pendientes;
    private long enProgreso;
    private long finalizadas;

    public EstadisticasDTO() {
    }

    public EstadisticasDTO(long total, long pendientes, long enProgreso, long finalizadas) {
        this.total = total;
        this.pendientes = pendientes;
        this.enProgreso = enProgreso;
        this.finalizadas = finalizadas;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public long getPendientes() {
        return pendientes;
    }

    public void setPendientes(long pendientes) {
        this.pendientes = pendientes;
    }

    public long getEnProgreso() {
        return enProgreso;
    }

    public void setEnProgreso(long enProgreso) {
        this.enProgreso = enProgreso;
    }

    public long getFinalizadas() {
        return finalizadas;
    }

    public void setFinalizadas(long finalizadas) {
        this.finalizadas = finalizadas;
    }
}
