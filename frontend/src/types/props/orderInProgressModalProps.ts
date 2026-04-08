import type { Order } from "../order";

export interface OrderInProgressModalProps {
    order: Order;
    onClose: () => void;
}