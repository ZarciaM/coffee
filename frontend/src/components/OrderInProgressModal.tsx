import React from 'react';
import { motion } from 'framer-motion';
import { X, Coffee, Truck, CreditCard, Package, CheckCircle } from 'lucide-react';
import type { OrderInProgressModalProps } from '../types/props/orderInProgressModalProps';

const deliveryIcons: Record<string, React.ReactNode> = {
    bike: '🚲',
    motorcycle: '🏍️',
    truck: '🚚',
    ship: '🚢'
};

export const OrderInProgressModal: React.FC<OrderInProgressModalProps> = ({ order, onClose }) => {
    const steps = [
        { id: 'pending', label: 'Commande', icon: <Coffee className="w-4 h-4" /> },
        { id: 'brewing', label: 'Préparation', icon: <Coffee className="w-4 h-4" /> },
        { id: 'paying', label: 'Paiement', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'delivering', label: 'Livraison', icon: <Truck className="w-4 h-4" /> },
        { id: 'completed', label: 'Terminé', icon: <Package className="w-4 h-4" /> }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === order.status);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    if (!order.delivery || !order.payment) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md">
                    <h3 className="text-xl font-bold text-red-600 mb-4">Erreur de données</h3>
                    <p>Les informations de livraison ou de paiement sont manquantes.</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = order.coffee.cost + (order.delivery?.price || 0);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            >
                <div className="bg-linear-to-r from-blue-600 to-green-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Commande en cours</h2>
                            <p className="text-sm opacity-90">ID: #{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-center mb-6">
                        <motion.div
                            className="text-5xl"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {deliveryIcons[order.delivery.type]}
                        </motion.div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progression</span>
                            <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-linear-to-r from-blue-600 to-green-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = order.status === step.id;

                            return (
                                <div key={step.id} className="flex items-center space-x-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        ${isCompleted ? 'bg-green-100 text-green-600' :
                                            isCurrent ? 'bg-blue-100 text-blue-600' :
                                                'bg-gray-100 text-gray-400'}
                                    `}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                                            {step.label}
                                        </p>
                                        {isCurrent && (
                                            <p className="text-xs text-gray-500">
                                                En cours...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Café</span>
                            <span className="font-bold">{order.coffee.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Livraison</span>
                            <span className="font-bold">{order.delivery.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Paiement</span>
                            <span className="font-bold">{order.payment.name}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-lg font-bold text-green-600">
                                {totalPrice.toLocaleString('fr-FR')} MGA
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};