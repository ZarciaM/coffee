import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Zap, PlusCircle } from 'lucide-react';
import type { CoffeeCardProps } from '../types/props/coffeeCardProps';
import { AnimatedCard } from './AnimatedCard';

export const CoffeeCard: React.FC<CoffeeCardProps> = ({ coffee, isSelected, onClick }) => {
    const getStrengthFromCost = (cost: number): number => {
        if (cost < 3500) return 1;
        if (cost < 4500) return 2;
        if (cost < 5500) return 3;
        return 4;
    };

    const getDescription = (name: string, addinsCount: number): string => {
        return `${name} premium avec ${addinsCount > 0 ? `${addinsCount} additifs` : 'aucun additif'}`;
    };

    const getImageUrl = (name: string): string => {
        const coffeeImages: Record<string, string> = {
            'Espresso': '',
            'Cappuccino': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop',
            'Latte': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=300&fit=crop',
            'Americano': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            'Mocha': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
            'Flat White': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop'
        };
        return coffeeImages[name] || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop';
    };

    const strength = coffee.strength || getStrengthFromCost(coffee.cost);
    const description = coffee.description || getDescription(coffee.name, coffee.addins?.length || 0);
    const image = coffee.image || getImageUrl(coffee.name);

    return (
        <AnimatedCard
            onClick={onClick}
            isSelected={isSelected}
            className="overflow-hidden group w-full max-w-sm bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative h-48 overflow-hidden rounded-t-xl">
                <motion.img
                    src={image}
                    alt={coffee.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-4 left-4"
                >
                    <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-bold text-white">{strength}/5</span>
                    </div>
                </motion.div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">
                    <span className="text-lg font-bold text-purple-700">
                        {coffee.cost.toLocaleString()} MGA
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {coffee.name}
                        </h3>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {description}
                    </p>

                    {coffee.addins && coffee.addins.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {coffee.addins.slice(0, 3).map((addin) => (
                                <span
                                    key={addin.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                                >
                                    <PlusCircle className="w-3 h-3 mr-1" />
                                    {addin.name}
                                </span>
                            ))}
                            {coffee.addins.length > 3 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{coffee.addins.length - 3} autres
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < strength ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{strength}/5</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{coffee.preparationTime}s</span>
                    </div>
                </div>
            </div>

            {isSelected && (
                <motion.div
                    className="absolute top-0 right-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <div className="relative">
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-linear-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-lg" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
                    </div>
                </motion.div>
            )}

            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </AnimatedCard>
    );
};