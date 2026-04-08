export interface ApiCoffee {
    id: string;
    name: string;
    cost: number;
    preparationTime: number;
    addins: ApiAddin[];
}

export interface ApiAddin {
    id: string;
    name: string;
    price: number;
}