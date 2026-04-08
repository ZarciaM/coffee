export interface ApiPayment {
    id: string;
    paymentDate: string;
    transactionReference: string;
    totalAmount: number;
    phoneNumber?: string;
    secretCode?: string;
    cardNumber?: string;
    amount?: number;
    delivery?: ApiDelivery;
}

export interface ApiDelivery {
    id: string;
    date: string;
    placeToDeliver: string;
    duration: number;
    vehicles: Vehicle[];
    coffeeOrders: CoffeeOrder[];
    statusHistory: DeliveryStatus[];
}

export interface Vehicle {
    id: string;
    name: string;
    price: number;
    timeGain: number;
}

export interface CoffeeOrder {
    id: string;
    totalPrice: number;
    coffees: CoffeeItem[];
    statuses: OrderStatus[];
}

export interface CoffeeItem {
    id: string;
    name: string;
    cost: number;
    preparationTime: number;
    addins: Addin[];
}

export interface Addin {
    id: string;
    name: string;
    price: number;
}

export interface OrderStatus {
    id: string;
    status: string;
    statusDate: string;
}

export interface DeliveryStatus {
    deliveryStatus: string;
    date: string;
    id: string;
}

export interface ApiOrder {
    id: string;
    totalPrice: number;
    coffees: ApiCoffee[];
    statuses: OrderStatus[];
}

export interface ApiCoffee {
    id: string;
    name: string;
    cost: number;
    preparationTime: number;
    addins: Addin[];
}

export interface PaymentHistory {
    id: string;
    paymentDate: string;
    transactionReference: string;
    totalAmount: number;
    phoneNumber?: string;
    secretCode?: string;
    cardNumber?: string;
    amount?: number;
    delivery?: ApiDelivery;
    coffeeOrder?: CoffeeOrder;
    method?: string;
    status?: string;
}