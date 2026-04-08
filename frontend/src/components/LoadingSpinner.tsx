import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import type { LoadingSpinnerProps } from '../types/props/loadingSpinnerProps';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Préparation en cours...',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
                <motion.div
                    className={`${sizeClasses[size]} relative`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600" />
                </motion.div>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Coffee className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-purple-600`} />
                </motion.div>
            </div>
            {message && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 font-medium"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};