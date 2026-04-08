export interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    onClick?: () => void;
    isSelected?: boolean;
}