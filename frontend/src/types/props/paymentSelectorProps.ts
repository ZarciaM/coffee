import type { PaymentMethod } from "../paymentMethod";

export interface PaymentSelectorProps {
    payments: PaymentMethod[];
    selectedPayment: PaymentMethod | null;
    onSelectPayment: (payment: PaymentMethod) => void;
}