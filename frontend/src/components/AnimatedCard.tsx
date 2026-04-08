import React from 'react';
import { motion } from 'framer-motion';
import type { AnimatedCardProps } from '../types/props/animatedCardProps';

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    className = '',
    delay = 0,
    onClick,
    isSelected = false,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isSelected ? 1.02 : 1,
                boxShadow: isSelected
                    ? '0 20px 60px -12px rgba(147, 51, 234, 0.3)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{
                scale: isSelected ? 1.02 : 1.05,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
                duration: 0.3,
                delay: delay * 0.1,
                type: "spring",
                stiffness: 100
            }}
            className={`
        cursor-pointer rounded-xl border-2 transition-all duration-300
        ${isSelected
                    ? 'border-purple-500 bg-linear-to-br from-purple-50 to-white'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }
        ${className}
        `}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};