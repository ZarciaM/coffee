import type { Coffee } from "./coffee";
import type { DeliveryMethod } from "./deliveryMethod";
import type { PaymentMethod } from "./paymentMethod";

export interface Order {
    id: string;
    coffee: Coffee;
    payment?: PaymentMethod;
    delivery?: DeliveryMethod;
    status: 'pending' | 'brewing' | 'paying' | 'delivering' | 'completed';
    createdAt: Date;
    userId?: string;
    totalPrice?: number;
    orderNumber?: string;
}
