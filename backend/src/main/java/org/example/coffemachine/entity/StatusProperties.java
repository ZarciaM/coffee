package org.example.coffemachine.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.coffemachine.entity.Delivery;
import org.example.coffemachine.entity.DeliveryStatus;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "status_properties")
public class StatusProperties {
    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;
    @Enumerated(EnumType.STRING)
    @Column(name = "status") // IMPORTANT : correspond EXACTEMENT à ta colonne SQL
    private DeliveryStatus deliveryStatus;
    private LocalDateTime date;
    @ManyToOne
    @JoinColumn(name = "id_delivery")
    @JsonBackReference
    private Delivery delivery;
    public StatusProperties() {
        this.id = UUID.randomUUID();
    }
    public StatusProperties(Delivery delivery, DeliveryStatus deliveryStatus, LocalDateTime date) {
        this.id = UUID.randomUUID();
        this.delivery = delivery;
        this.deliveryStatus = deliveryStatus;
        this.date = date;
    }
}