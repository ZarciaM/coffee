export interface PaymentMethod {
    id: string;
    name: string;
    type: 'card' | 'mobile' | 'cash';
    icon: string;
    available?: boolean;
}

export const STATIC_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Carte bancaire',
        type: 'card',
        icon: '💳',
        available: true
    },
    {
        id: 'mobile',
        name: 'Mobile Money',
        type: 'mobile',
        icon: '📱',
        available: true
    },
    {
        id: 'cash',
        name: 'Espèces',
        type: 'cash',
        icon: '💰',
        available: true
    }
];