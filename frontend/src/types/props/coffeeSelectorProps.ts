import type { Coffee } from "../coffee";

export interface CoffeeSelectorProps {
    coffees: Coffee[];
    selectedCoffee: Coffee | null;
    onSelectCoffee: (coffee: Coffee) => void;
}