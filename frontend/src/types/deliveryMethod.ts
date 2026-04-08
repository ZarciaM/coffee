export interface DeliveryMethod {
    id: string;
    name: string;
    type: 'bike' | 'motorcycle' | 'truck' | 'ship';
    estimatedTime: number; 
    icon: string;
    price: number;
    available?: boolean;
}