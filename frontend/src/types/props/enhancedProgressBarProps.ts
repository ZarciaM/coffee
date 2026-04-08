export interface EnhancedProgressBarProps {
    steps: Array<{
        name: string;
        status: 'pending' | 'current' | 'completed';
        icon: React.ReactNode;
    }>;
    currentStepIndex: number;
}