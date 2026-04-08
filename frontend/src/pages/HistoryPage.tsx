import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Calendar, Package, CreditCard, RefreshCw, DollarSign, Receipt, CheckCircle, XCircle, Clock, Trash2, Eye, ExternalLink } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import type { ApiDelivery, CoffeeOrder } from '../types/api-types';

interface PaymentHistory {
    id: string;
    paymentDate: string;
    transactionReference: string;
    totalAmount: number;
    phoneNumber?: string;
    secretCode?: string;
    cardNumber?: string;
    amount?: number;
    delivery?: ApiDelivery;
    coffeeOrder?: CoffeeOrder;
    method?: string;
    status?: string;
}

interface StoreOrder {
    id: string;
    status: string;
    coffee?: {
        cost: number;
        price: number;
        name: string;
        description: string;
        image: string;
    };
    delivery?: {
        price: number;
        name: string;
    };
    payment?: {
        name: string;
        type: string;
    };
    createdAt: Date | string;
}

export const HistoryPage: React.FC = () => {
    const { orderHistory, fetchOrderHistory, loading, userProfile } = useOrderStore();
    const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchPaymentHistory = useCallback(async () => {
        setLoadingPayments(true);
        try {
            const response = await fetch(`${apiUrl}/api/payments`);
            if (!response.ok) {
                throw new Error('Failed to fetch payment history');
            }
            const data = await response.json();
            console.log('Payment history data:', data);
            setPaymentHistory(data);
            toast.success('Historique des paiements actualisé!');
        } catch (error) {
            console.error('Error fetching payment history:', error);
            setPaymentHistory([]);
            toast.error('Erreur lors du chargement des paiements');
        } finally {
            setLoadingPayments(false);
        }
    }, [apiUrl]);

    const fetchOrderHistoryWithToast = useCallback(async () => {
        const toastId = toast.loading('Chargement de l\'historique...');
        try {
            await fetchOrderHistory();
            toast.success('Historique chargé avec succès!', { id: toastId });
        } catch {
            toast.error('Erreur lors du chargement', { id: toastId });
        }
    }, [fetchOrderHistory]);

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrderHistoryWithToast();
        } else {
            fetchPaymentHistory();
        }
    }, [activeTab, fetchOrderHistoryWithToast, fetchPaymentHistory]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getPaymentMethodIcon = (method?: string) => {
        if (!method) return '💳';

        const methodLower = method.toLowerCase();
        if (methodLower.includes('card') || methodLower.includes('carte')) {
            return '💳';
        } else if (methodLower.includes('mobile') || methodLower.includes('money')) {
            return '📱';
        } else if (methodLower.includes('cash') || methodLower.includes('espèces')) {
            return '💰';
        }
        return '💳';
    };

    const getPaymentStatusIcon = (status?: string) => {
        if (!status) return <CheckCircle className="w-4 h-4 text-yellow-500" />;

        const statusLower = status.toLowerCase();
        if (statusLower.includes('completed') || statusLower.includes('success')) {
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        } else if (statusLower.includes('failed') || statusLower.includes('error')) {
            return <XCircle className="w-4 h-4 text-red-500" />;
        } else if (statusLower.includes('pending')) {
            return <Clock className="w-4 h-4 text-yellow-500" />;
        }
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    };

    const getPaymentStatusText = (status?: string) => {
        if (!status) return 'En attente';

        const statusLower = status.toLowerCase();
        if (statusLower.includes('completed') || statusLower.includes('success')) {
            return 'Terminé';
        } else if (statusLower.includes('failed') || statusLower.includes('error')) {
            return 'Échoué';
        } else if (statusLower.includes('pending')) {
            return 'En attente';
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const openPaymentModal = (payment: PaymentHistory) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const openOrderModal = (order: StoreOrder) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    const handleRefresh = () => {
        if (activeTab === 'orders') {
            fetchOrderHistoryWithToast();
        } else {
            fetchPaymentHistory();
        }
    };

    const confirmDelete = (_id: string, type: 'order' | 'payment') => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="shrink-0 pt-0.5">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Confirmer la suppression
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            toast.success(`${type === 'order' ? 'Commande' : 'Paiement'} supprimé!`);
                        }}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
                    >
                        Supprimer
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center'
        });
    };

    const renderOrders = () => {
        if (loading) {
            return (
                <div className="py-12">
                    <LoadingSpinner message="Chargement de l'historique..." size="lg" />
                </div>
            );
        }

        if (orderHistory.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-12"
                >
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-linear-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <HistoryIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                        Aucune commande passée
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                        Vous n'avez pas encore passé de commande. Découvrez notre sélection de cafés et passez votre première commande !
                    </p>
                    <Link to="/commander">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 md:px-8 md:py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            Explorer les cafés
                        </motion.button>
                    </Link>
                </motion.div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {(orderHistory as StoreOrder[]).map((order, index) => {
                    const coffeeCost = order.coffee?.cost || order.coffee?.price || 0;
                    const deliveryCost = order.delivery?.price || 0;
                    const totalCost = coffeeCost + deliveryCost;

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-4 md:p-6">
                                <div className="flex justify-between items-start mb-3 md:mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1 md:mb-2">
                                            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${order.status === 'completed' ? 'bg-green-500' :
                                                order.status === 'delivering' ? 'bg-blue-500' :
                                                    order.status === 'paying' ? 'bg-yellow-500' :
                                                        order.status === 'brewing' ? 'bg-orange-500' :
                                                            'bg-gray-500'
                                                }`} />
                                            <span className={`text-xs md:text-sm font-medium ${order.status === 'completed' ? 'text-green-600' :
                                                order.status === 'delivering' ? 'text-blue-600' :
                                                    order.status === 'paying' ? 'text-yellow-600' :
                                                        order.status === 'brewing' ? 'text-orange-600' :
                                                            'text-gray-600'
                                                }`}>
                                                {order.status === 'completed' ? 'Livrée' :
                                                    order.status === 'delivering' ? 'En livraison' :
                                                        order.status === 'paying' ? 'En paiement' :
                                                            order.status === 'brewing' ? 'En préparation' :
                                                                'En attente'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                            Commande #{order.id.slice(0, 8).toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-500">
                                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="text-xs md:text-sm">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date inconnue'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <div
                                        className="flex items-center space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => openOrderModal(order)}
                                    >
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0">
                                            {order.coffee?.image ? (
                                                <img
                                                    src={order.coffee.image}
                                                    alt={order.coffee.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-r from-purple-200 to-pink-200 flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-purple-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <div className="truncate">
                                                    <h4 className="font-bold text-gray-900 truncate">{order.coffee?.name || 'Café'}</h4>
                                                    <p className="text-xs md:text-sm text-gray-600 truncate">
                                                        {order.coffee?.description || 'Description non disponible'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-base md:text-lg font-bold text-purple-600 whitespace-nowrap">
                                                        {coffeeCost.toLocaleString('fr-FR')} MGA
                                                    </div>
                                                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {order.payment && (
                                            <div className="p-2 md:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                <div className="flex items-center space-x-1 md:space-x-2 mb-1 md:mb-2">
                                                    <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                                                    <span className="text-xs md:text-sm font-medium text-blue-700">Paiement</span>
                                                </div>
                                                <p className="font-semibold text-gray-900 text-sm md:text-base">
                                                    {order.payment.name || 'Non spécifié'}
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-600">
                                                    {order.payment.type === 'card' && 'Carte bancaire'}
                                                    {order.payment.type === 'mobile' && 'Mobile Money'}
                                                    {order.payment.type === 'cash' && 'Espèces'}
                                                    {!order.payment.type && 'Non spécifié'}
                                                </p>
                                            </div>
                                        )}

                                        {order.delivery && (
                                            <div className="p-2 md:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                                <div className="flex items-center space-x-1 md:space-x-2 mb-1 md:mb-2">
                                                    <Package className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                                                    <span className="text-xs md:text-sm font-medium text-green-700">Livraison</span>
                                                </div>
                                                <p className="font-semibold text-gray-900 text-sm md:text-base">
                                                    {order.delivery.name || 'Non spécifié'}
                                                </p>
                                                <p className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                                                    +{deliveryCost.toLocaleString('fr-FR')} MGA
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 md:pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base md:text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-lg md:text-xl font-bold text-green-600">
                                                {totalCost.toLocaleString('fr-FR')} MGA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
                                <Link to="/commander" className="flex-1">
                                    <button className="w-full py-2 md:py-3 bg-linear-to-r from-purple-100 to-pink-100 text-purple-600 font-bold rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all text-sm md:text-base">
                                        Commander à nouveau
                                    </button>
                                </Link>
                                <button
                                    onClick={() => confirmDelete(order.id, 'order')}
                                    className="px-4 py-2 md:py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all text-sm md:text-base"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    const renderPayments = () => {
        if (loadingPayments) {
            return (
                <div className="py-12">
                    <LoadingSpinner message="Chargement des paiements..." size="lg" />
                </div>
            );
        }

        if (paymentHistory.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-12"
                >
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-linear-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <Receipt className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                        Aucun paiement trouvé
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                        {userProfile ?
                            'Vous n\'avez pas encore effectué de paiement. Vos transactions apparaîtront ici.' :
                            'Connectez-vous pour voir votre historique de paiements.'
                        }
                    </p>
                </motion.div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {paymentHistory.map((payment, index) => {
                    const paymentMethod = payment.method ||
                        (payment.phoneNumber ? 'Mobile Money' :
                            payment.cardNumber ? 'Carte bancaire' :
                                'Espèces');

                    const status = payment.status || 'completed';
                    const statusText = getPaymentStatusText(status);

                    return (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-4 md:p-6">
                                <div className="flex justify-between items-start mb-3 md:mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1 md:mb-2">
                                            {getPaymentStatusIcon(status)}
                                            <span className={`text-xs md:text-sm font-medium ${status.toLowerCase().includes('completed') || status.toLowerCase().includes('success')
                                                    ? 'text-green-600'
                                                    : status.toLowerCase().includes('failed') || status.toLowerCase().includes('error')
                                                        ? 'text-red-600'
                                                        : 'text-yellow-600'
                                                }`}>
                                                {statusText}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                            Paiement #{payment.transactionReference?.slice(0, 8) || payment.id.slice(0, 8).toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-1 md:space-x-2 text-gray-500">
                                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="text-xs md:text-sm">
                                            {formatDate(payment.paymentDate)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 md:space-y-6">
                                    <div
                                        className="flex items-center justify-between p-3 md:p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 cursor-pointer transition-all"
                                        onClick={() => openPaymentModal(payment)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="text-3xl">
                                                {getPaymentMethodIcon(paymentMethod)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Méthode de paiement</h4>
                                                <p className="text-sm text-gray-600">{paymentMethod}</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-blue-600" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">Montant total</p>
                                            <p className="text-xl md:text-2xl font-bold text-green-600">
                                                {(payment.totalAmount || payment.amount || 0).toLocaleString('fr-FR')} MGA
                                            </p>
                                        </div>
                                        <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">Référence</p>
                                            <p className="text-sm md:text-base font-mono font-medium text-gray-900 truncate">
                                                {payment.transactionReference || `PAY-${payment.id.slice(0, 8)}`}
                                            </p>
                                        </div>
                                    </div>

                                    {payment.coffeeOrder && (
                                        <div className="p-3 md:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Package className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                                <span className="text-sm md:text-base font-medium text-purple-700">Commande associée</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Commande #{payment.coffeeOrder.id?.slice(0, 8) || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Total: {(payment.coffeeOrder.totalPrice || 0).toLocaleString('fr-FR')} MGA
                                                    </p>
                                                </div>
                                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    )}

                                    {payment.phoneNumber && (
                                        <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">Numéro de téléphone</p>
                                            <p className="text-sm md:text-base font-medium text-gray-900">
                                                {payment.phoneNumber}
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-3 md:pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm md:text-base font-medium text-gray-700">Statut du paiement</span>
                                            <div className="flex items-center space-x-2">
                                                {getPaymentStatusIcon(status)}
                                                <span className={`text-sm font-medium ${status.toLowerCase().includes('completed') || status.toLowerCase().includes('success')
                                                        ? 'text-green-600'
                                                        : status.toLowerCase().includes('failed') || status.toLowerCase().includes('error')
                                                            ? 'text-red-600'
                                                            : 'text-yellow-600'
                                                    }`}>
                                                    {statusText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
                                <button
                                    onClick={() => openPaymentModal(payment)}
                                    className="flex-1 py-2 md:py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all text-sm md:text-base"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <Eye className="w-4 h-4" />
                                        <span>Voir détails</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => confirmDelete(payment.id, 'payment')}
                                    className="px-4 py-2 md:py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-all text-sm md:text-base"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-purple-50 py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 md:mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium">
                                <span>← Retour à l'accueil</span>
                            </Link>
                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Actualiser</span>
                            </button>
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Historique
                        </h1>
                        <p className="text-gray-600">
                            {activeTab === 'orders'
                                ? `Retrouvez toutes vos commandes passées (${orderHistory.length} commandes)`
                                : `Retrouvez tous vos paiements effectués (${paymentHistory.length} paiements)`
                            }
                        </p>
                    </div>

                    <div className="mb-6 md:mb-8">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 py-3 px-4 text-sm md:text-base font-medium rounded-lg transition-all duration-200 ${activeTab === 'orders'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <Package className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Commandes</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`flex-1 py-3 px-4 text-sm md:text-base font-medium rounded-lg transition-all duration-200 ${activeTab === 'payments'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>Paiements</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {activeTab === 'orders' ? renderOrders() : renderPayments()}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Détails du paiement"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            >
                {selectedPayment && (
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Détails du paiement
                                    </h2>
                                    <p className="text-gray-600">
                                        #{selectedPayment.transactionReference || selectedPayment.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-blue-700 mb-2">Montant</h3>
                                        <p className="text-3xl font-bold text-green-600">
                                            {(selectedPayment.totalAmount || selectedPayment.amount || 0).toLocaleString('fr-FR')} MGA
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-purple-700 mb-2">Statut</h3>
                                        <div className="flex items-center space-x-2">
                                            {getPaymentStatusIcon(selectedPayment.status)}
                                            <span className="text-lg font-medium">
                                                {getPaymentStatusText(selectedPayment.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-medium text-gray-700 mb-3">Informations de paiement</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium">{formatDate(selectedPayment.paymentDate)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Méthode</span>
                                            <span className="font-medium">
                                                {selectedPayment.method ||
                                                    (selectedPayment.phoneNumber ? 'Mobile Money' :
                                                        selectedPayment.cardNumber ? 'Carte bancaire' : 'Espèces')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Référence</span>
                                            <span className="font-medium font-mono">
                                                {selectedPayment.transactionReference || `PAY-${selectedPayment.id.slice(0, 8)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {selectedPayment.phoneNumber && (
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-green-700 mb-2">Mobile Money</h3>
                                        <p className="text-lg font-medium">{selectedPayment.phoneNumber}</p>
                                    </div>
                                )}

                                {selectedPayment.cardNumber && (
                                    <div className="bg-yellow-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-yellow-700 mb-2">Carte bancaire</h3>
                                        <p className="text-lg font-mono">•••• •••• •••• {selectedPayment.cardNumber.slice(-4)}</p>
                                    </div>
                                )}

                                {selectedPayment.coffeeOrder && (
                                    <div className="bg-purple-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-purple-700 mb-3">Commande associée</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Numéro de commande</span>
                                                <span className="font-medium">
                                                    #{selectedPayment.coffeeOrder.id?.slice(0, 8) || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Montant de la commande</span>
                                                <span className="font-bold text-purple-600">
                                                    {(selectedPayment.coffeeOrder.totalPrice || 0).toLocaleString('fr-FR')} MGA
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        onClick={() => {
                                            toast.success('Ticket téléchargé!');
                                        }}
                                        className="flex-1 py-3 px-6 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                                    >
                                        Télécharger le reçu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={isOrderModalOpen}
                onRequestClose={() => setIsOrderModalOpen(false)}
                contentLabel="Détails de la commande"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            >
                {selectedOrder && (
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Détails de la commande
                                    </h2>
                                    <p className="text-gray-600">
                                        #{selectedOrder.id?.slice(0, 8).toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOrderModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{selectedOrder.coffee?.name}</h3>
                                            <p className="text-gray-600">{selectedOrder.coffee?.description}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            {selectedOrder.coffee?.cost?.toLocaleString('fr-FR') || '0'} MGA
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-gray-700 mb-3">Livraison</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service</span>
                                                <span className="font-medium">{selectedOrder.delivery?.name || 'Non spécifié'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Coût</span>
                                                <span className="font-medium text-green-600">
                                                    +{(selectedOrder.delivery?.price || 0).toLocaleString('fr-FR')} MGA
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <h3 className="font-medium text-gray-700 mb-3">Paiement</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Méthode</span>
                                                <span className="font-medium">{selectedOrder.payment?.name || 'Non spécifié'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Type</span>
                                                <span className="font-medium">
                                                    {selectedOrder.payment?.type === 'card' && 'Carte bancaire'}
                                                    {selectedOrder.payment?.type === 'mobile' && 'Mobile Money'}
                                                    {selectedOrder.payment?.type === 'cash' && 'Espèces'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl">
                                    <h3 className="font-medium text-green-700 mb-3">Total</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Montant total de la commande</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            {(
                                                (selectedOrder.coffee?.cost || 0) +
                                                (selectedOrder.delivery?.price || 0)
                                            ).toLocaleString('fr-FR')} MGA
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-xl">
                                    <h3 className="font-medium text-yellow-700 mb-3">Statut</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${selectedOrder.status === 'completed' ? 'bg-green-500' :
                                            selectedOrder.status === 'delivering' ? 'bg-blue-500' :
                                                selectedOrder.status === 'paying' ? 'bg-yellow-500' :
                                                    selectedOrder.status === 'brewing' ? 'bg-orange-500' :
                                                        'bg-gray-500'
                                            }`} />
                                        <span className="text-lg font-medium">
                                            {selectedOrder.status === 'completed' ? 'Livrée' :
                                                selectedOrder.status === 'delivering' ? 'En livraison' :
                                                    selectedOrder.status === 'paying' ? 'En paiement' :
                                                        selectedOrder.status === 'brewing' ? 'En préparation' :
                                                            'En attente'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsOrderModalOpen(false)}
                                        className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Fermer
                                    </button>
                                    <Link to="/commander" className="flex-1">
                                        <button
                                            onClick={() => setIsOrderModalOpen(false)}
                                            className="w-full py-3 px-6 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                                        >
                                            Commander à nouveau
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};