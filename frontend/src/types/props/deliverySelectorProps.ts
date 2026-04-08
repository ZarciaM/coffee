import type { DeliveryMethod } from "../deliveryMethod";

export interface DeliverySelectorProps {
    deliveries: DeliveryMethod[];
    selectedDelivery: DeliveryMethod | null;
    onSelectDelivery: (delivery: DeliveryMethod) => void;
}