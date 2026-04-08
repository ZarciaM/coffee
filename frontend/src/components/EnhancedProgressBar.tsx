import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import { Check } from 'lucide-react';
import type { EnhancedProgressBarProps } from '../types/props/enhancedProgressBarProps';

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
    steps,
    currentStepIndex
}) => {
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full space-y-8">
            <div className="relative">
                <div className="absolute left-0 right-0 top-6 h-1 bg-gray-200 -translate-y-1/2">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="relative flex justify-between">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.name}
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center
                                    border-4 relative z-10
                                    ${step.status === 'completed'
                                        ? 'bg-linear-to-br from-green-500 to-emerald-600 border-green-100'
                                        : step.status === 'current'
                                            ? 'bg-linear-to-br from-purple-500 to-pink-500 border-purple-100 animate-pulse'
                                            : 'bg-white border-gray-200'
                                    }
                                `}
                                whileHover={{ scale: 1.1 }}
                            >
                                {step.status === 'completed' ? (
                                    <Check className="w-6 h-6 text-white" />
                                ) : (
                                    <div className={step.status === 'current' ? 'text-white' : 'text-gray-400'}>
                                        {step.icon}
                                    </div>
                                )}
                            </motion.div>
                            <span className={`
                                            mt-3 text-sm font-medium
                                            ${step.status === 'completed' ? 'text-green-600' :
                                    step.status === 'current' ? 'text-purple-600 font-bold' :
                                        'text-gray-500'}
                                    `}
                            >
                                {step.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Progression</span>
                    <motion.span
                        key={progress}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="font-bold text-purple-600"
                    >
                        {Math.round(progress)}%
                    </motion.span>
                </div>
                <Progress.Root
                    className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3"
                    value={progress}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </Progress.Root>
            </div>
        </div>
    );
};