import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { AnimatedCard } from './AnimatedCard';
import { LoadingSpinner } from './LoadingSpinner';

const getDeliveryIcon = (type: string) => {
    const icons = {
        bike: { icon: '🚲', color: 'from-green-500 to-emerald-500' },
        motorcycle: { icon: '🏍️', color: 'from-blue-500 to-cyan-500' },
        truck: { icon: '🚚', color: 'from-orange-500 to-amber-500' },
        ship: { icon: '🚢', color: 'from-purple-500 to-indigo-500' }
    };
    return icons[type as keyof typeof icons] || { icon: '🚗', color: 'from-gray-500 to-gray-700' };
};

export const DeliverySelector: React.FC = () => {
    const { deliveries, selectedDelivery, setSelectedDelivery, fetchDeliveries } = useOrderStore();

    useEffect(() => {
        if (deliveries.length === 0) {
            fetchDeliveries();
        }
    }, [deliveries.length, fetchDeliveries]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        return `${minutes} min`;
    };

    const formatPrice = (price: number) => {
        return `${price.toLocaleString('fr-FR')} MGA`;
    };

    if (deliveries.length === 0) {
        return <LoadingSpinner message="Chargement des modes de livraison..." size="sm" />;
    }

    return (
        <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
                <motion.div
                    className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-xl">🚚</span>
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mode de livraison</h2>
                    <p className="text-gray-600">Choisissez comment vous voulez recevoir votre café</p>
                </div>
            </div>

            {deliveries.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucun mode de livraison disponible pour le moment</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {deliveries.map((delivery, index) => (
                        <AnimatedCard
                            key={delivery.id}
                            delay={index}
                            isSelected={selectedDelivery?.id === delivery.id}
                            onClick={() => setSelectedDelivery(delivery)}
                            className="p-5"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <motion.div
                                    className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                                        bg-linear-to-br ${getDeliveryIcon(delivery.type).color}
                                    `}
                                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {delivery.icon || getDeliveryIcon(delivery.type).icon}
                                </motion.div>

                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 text-lg">{delivery.name}</h3>

                                    <div className="flex justify-center space-x-4">
                                        <motion.div
                                            className="flex items-center space-x-1 px-3 py-1 bg-blue-50 rounded-full"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700">
                                                {formatTime(delivery.estimatedTime)}
                                            </span>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center space-x-1 px-3 py-1 bg-green-50 rounded-full"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <span className="text-sm font-medium text-green-700">
                                                {formatPrice(delivery.price)}
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>

                                {delivery.type === 'motorcycle' && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full"
                                    >
                                        ⚡ Le plus rapide
                                    </motion.span>
                                )}
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            )}
        </div>
    );
};