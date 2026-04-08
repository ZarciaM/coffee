export interface Coffee {
    id: string;
    name: string;
    cost: number;
    preparationTime: number;
    addins: Addin[];
    description?: string;
    image?: string;
    strength?: number;
    category?: string;
    available?: boolean;
    price?: number;
}

export interface Addin {
    id: string;
    name: string;
    price: number;
}