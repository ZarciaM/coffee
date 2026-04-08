import type { Coffee } from "../coffee";

export interface CoffeeCardProps {
    coffee: Coffee;
    isSelected: boolean;
    onClick: () => void;
}