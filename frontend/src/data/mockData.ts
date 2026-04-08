import type { Coffee } from "../types/coffee";
import type { PaymentMethod } from "../types/paymentMethod";
import type { DeliveryMethod } from "../types/deliveryMethod";

export const mockCoffees: Coffee[] = [
    {
        id: '1',
        name: 'Tsy Lefy',
        description: 'Café fort et corsé',
        price: 3.5,
        brewingTime: 5000,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        strength: 4
    },
    {
        id: '2',
        name: 'Zoto',
        description: 'Café doux et aromatique',
        price: 2.8,
        brewingTime: 4000,
        image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb',
        strength: 2
    },
    {
        id: '3',
        name: 'Nescafé',
        description: 'Café instantané premium',
        price: 1.5,
        brewingTime: 2000,
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9c',
        strength: 3
    },
    {
        id: '4',
        name: 'Kopiko',
        description: 'Café sucré caramélisé',
        price: 2.2,
        brewingTime: 3000,
        image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca',
        strength: 3
    }
];

export const mockPaymentMethods: PaymentMethod[] = [
    {
        id: '1',
        name: 'Carte Bancaire',
        type: 'card',
        icon: '💳'
    },
    {
        id: '2',
        name: 'Mobile Money',
        type: 'mobile',
        icon: '📱'
    },
    {
        id: '3',
        name: 'Espèces',
        type: 'cash',
        icon: '💰'
    }
];

export const mockDeliveryMethods: DeliveryMethod[] = [
    {
        id: '1',
        name: 'Vélo',
        type: 'bike',
        estimatedTime: 900000,
        icon: '🚲',
        price: 1
    },
    {
        id: '2',
        name: 'Moto',
        type: 'motorcycle',
        estimatedTime: 600000,
        icon: '🏍️',
        price: 2
    },
    {
        id: '3',
        name: 'Camion',
        type: 'truck',
        estimatedTime: 1200000,
        icon: '🚚',
        price: 5
    },
    {
        id: '4',
        name: 'Bateau',
        type: 'ship',
        estimatedTime: 1800000,
        icon: '🚢',
        price: 10
    }
];