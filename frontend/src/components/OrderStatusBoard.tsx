import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

export const OrderStatusBoard: React.FC = () => {
    const { currentOrder, orderHistory, fetchOrderHistory, coffees, fetchCoffees, loading } = useOrderStore();

    useEffect(() => {
        fetchOrderHistory();
        if (coffees.length === 0) {
            fetchCoffees();
        }
    }, [fetchOrderHistory, fetchCoffees, coffees.length]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'brewing': return <Coffee className="w-4 h-4 text-orange-500" />;
            case 'paying': return <Package className="w-4 h-4 text-blue-500" />;
            case 'delivering': return <Truck className="w-4 h-4 text-purple-500" />;
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
            default: return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'brewing': return 'Préparation';
            case 'paying': return 'Paiement';
            case 'delivering': return 'Livraison';
            case 'completed': return 'Terminée';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    const activeOrders = currentOrder ? [currentOrder] : [];
    const recentOrders = orderHistory.slice(0, 3);

    const totalOrders = orderHistory.length;
    const activeOrdersCount = activeOrders.length;
    const averageOrderValue = totalOrders > 0 
        ? orderHistory.reduce((acc, order) => 
            acc + order.coffee.cost + (order.delivery?.price || 0), 0) / totalOrders 
        : 0;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Tableau des commandes</h3>

            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Commandes actives
                </h4>
                {activeOrders.length > 0 ? (
                    activeOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg mb-2"
                        >
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(order.status)}
                                <div>
                                    <p className="font-medium text-gray-900">{order.coffee.name}</p>
                                    <p className="text-xs text-gray-600">#{order.id.slice(0, 6)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-purple-600">{getStatusText(order.status)}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune commande active</p>
                    </div>
                )}
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Commandes récentes</h4>
                {recentOrders.length > 0 ? (
                    <div className="space-y-2">
                        {recentOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={order.coffee.image}
                                            alt={order.coffee.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-gray-900 truncate">{order.coffee.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-green-600">
                                        {(order.coffee.cost + (order.delivery?.price || 0)).toLocaleString('fr-FR')} MGA
                                    </p>
                                    <div className="flex items-center justify-end space-x-1">
                                        {getStatusIcon('completed')}
                                        <span className="text-xs text-gray-500">Terminée</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Aucune commande récente</p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">{totalOrders}</p>
                        <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{activeOrdersCount}</p>
                        <p className="text-xs text-gray-600">Actives</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{averageOrderValue.toLocaleString('fr-FR')} MGA</p>
                        <p className="text-xs text-gray-600">Moyenne</p>
                    </div>
                </div>
            </div>
        </div>
    );
};