import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, Package, User, MapPin, Lock, Coffee, Check, AlertCircle } from 'lucide-react';
import { CoffeeSelector } from '../components/CoffeeSelector';
import { PaymentSelector } from '../components/PaymentSelector';
import { DeliverySelector } from '../components/DeliverySelector';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useOrderStore } from '../store/useOrderStore';
import { Link } from 'react-router-dom';
import { EnhancedProgressBar } from '../components/EnhancedProgressBar';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';

export const OrderPage: React.FC = () => {
    const {
        selectedCoffee,
        selectedPayment,
        selectedDelivery,
        currentOrder,
        isProcessing,
        coffees,
        payments,
        deliveries,
        startOrder,
        completeOrder,
        resetOrder,
        fetchUserProfile,
        userProfile
    } = useOrderStore();

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const effectiveDeliveryAddress = useMemo(() => {
        if (userProfile?.address && !deliveryAddress) {
            return userProfile.address;
        }
        return deliveryAddress;
    }, [userProfile, deliveryAddress]);

    const step = useMemo(() => {
        if (!currentOrder) return 'order';

        if (currentOrder.status === 'pending' || currentOrder.status === 'brewing') {
            return 'preparation';
        } else if (currentOrder.status === 'paying') {
            return 'payment';
        } else if (currentOrder.status === 'delivering') {
            return 'delivery';
        } else if (currentOrder.status === 'completed') {
            return 'completed';
        }
        return 'order';
    }, [currentOrder]);

    const showOrderConfirm = () => {
        if (!selectedCoffee || !selectedPayment || !selectedDelivery) {
            toast.error('Veuillez sélectionner un café, un mode de paiement et une livraison', {
                duration: 4000,
                icon: '⚠️'
            });
            return;
        }

        if (!effectiveDeliveryAddress.trim()) {
            toast.error('Veuillez saisir votre adresse de livraison', {
                duration: 4000,
                icon: '📍'
            });
            return;
        }

        setShowConfirmModal(true);
    };

    const handleOrder = async () => {
        setShowConfirmModal(false);

        const toastId = toast.loading('Préparation de votre commande...', {
            icon: '☕'
        });

        try {
            await startOrder();
            toast.success('Commande passée avec succès!', {
                id: toastId,
                duration: 3000,
                icon: '✅'
            });
        } catch {
            toast.error('Erreur lors de la commande', {
                id: toastId,
                duration: 4000,
                icon: '❌'
            });
        }
    };

    const handlePayment = async () => {
        if (!selectedPayment || !currentOrder) return;

        let paymentValid = true;
        let errorMessage = '';

        switch (selectedPayment.type) {
            case 'card':
                if (!cardNumber.trim() || cardNumber.length !== 16) {
                    errorMessage = 'Veuillez saisir un numéro de carte valide (16 chiffres)';
                    paymentValid = false;
                }
                break;
            case 'mobile':
                if (!mobileNumber.trim() || !secretCode.trim()) {
                    errorMessage = 'Veuillez saisir votre numéro de téléphone et code secret';
                    paymentValid = false;
                }
                break;
            case 'cash': {
                const amount = parseFloat(cashAmount);
                const totalPrice = currentOrder.coffee.cost + (currentOrder.delivery?.price || 0);
                if (isNaN(amount) || amount < totalPrice) {
                    errorMessage = `Veuillez saisir un montant d'au moins ${totalPrice.toLocaleString('fr-FR')} MGA`;
                    paymentValid = false;
                }
                break;
            }
            default:
                errorMessage = 'Méthode de paiement invalide';
                paymentValid = false;
                break;
        }

        if (!paymentValid) {
            toast.error(errorMessage, {
                duration: 4000,
                icon: '⚠️'
            });
            return;
        }

        const toastId = toast.loading('Traitement du paiement...', {
            icon: '💳'
        });

        try {
            await completeOrder();

            toast.success('Paiement effectué avec succès! Livraison en cours.', {
                id: toastId,
                duration: 4000,
                icon: '✅'
            });

            setTimeout(() => {
                resetOrder();
                setCardNumber('');
                setMobileNumber('');
                setSecretCode('');
                setCashAmount('');
            }, 1000);

        } catch {
            toast.error('Erreur lors du paiement. Veuillez réessayer.', {
                id: toastId,
                duration: 4000,
                icon: '❌'
            });
        }
    };

    const cancelOrder = () => {
        setShowCancelModal(true);
    };

    const confirmCancelOrder = () => {
        resetOrder();
        setShowCancelModal(false);
        toast('Commande annulée', {
            duration: 3000,
            icon: '🗑️'
        });
    };

    const showInfoToast = (message: string) => {
        toast(message, {
            duration: 3000,
            icon: 'ℹ️'
        });
    };

    if (coffees.length === 0 || payments.length === 0 || deliveries.length === 0) {
        return (
            <div className="min-h-screen bg-white py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <LoadingSpinner message="Chargement des données..." size="lg" />
                </div>
            </div>
        );
    }

    const totalCost = ((selectedCoffee?.cost || 0) + (selectedDelivery?.price || 0));

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                    loading: {
                        iconTheme: {
                            primary: '#8b5cf6',
                            secondary: '#f3f4f6',
                        },
                    },
                }}
            />

            <div className="min-h-screen bg-white py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-4">
                            <span>← Retour à l'accueil</span>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center">
                            Commander votre café
                        </h1>
                        <p className="text-gray-600 text-center max-w-2xl mx-auto">
                            Sélectionnez vos préférences et passez votre commande
                        </p>
                    </div>

                    {currentOrder && (
                        <div className="mb-8 max-w-4xl mx-auto">
                            <EnhancedProgressBar
                                steps={[
                                    { name: 'Commande', status: 'completed', icon: <Package className="w-4 h-4" /> },
                                    { name: 'Préparation', status: currentOrder.status === 'brewing' ? 'current' : 'pending', icon: <Coffee className="w-4 h-4" /> },
                                    { name: 'Paiement', status: currentOrder.status === 'paying' ? 'current' : 'pending', icon: <CreditCard className="w-4 h-4" /> },
                                    { name: 'Livraison', status: currentOrder.status === 'delivering' ? 'current' : 'pending', icon: <Truck className="w-4 h-4" /> },
                                    { name: 'Terminé', status: currentOrder.status === 'completed' ? 'completed' : 'pending', icon: <Lock className="w-4 h-4" /> },
                                ]}
                                currentStepIndex={
                                    currentOrder.status === 'pending' ? 0 :
                                        currentOrder.status === 'brewing' ? 1 :
                                            currentOrder.status === 'paying' ? 2 :
                                                currentOrder.status === 'delivering' ? 3 : 4
                                }
                            />
                        </div>
                    )}

                    {step === 'preparation' && currentOrder && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-6xl mb-6"
                                >
                                    ☕
                                </motion.div>

                                <h2 className="text-2xl font-bold text-black mb-4">
                                    Préparation en cours
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Votre {currentOrder.coffee.name} est en préparation
                                </p>

                                <LoadingSpinner
                                    message={`Préparation de votre ${currentOrder.coffee.name}...`}
                                    size="lg"
                                />

                                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Temps estimé</span>
                                            <span className="font-medium">{currentOrder.coffee.preparationTime} secondes</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Numéro de commande</span>
                                            <span className="font-medium">#{currentOrder.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => showInfoToast('Notre barista prépare votre café avec soin!')}
                                    className="mt-6 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    En savoir plus sur la préparation
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'order' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6"
                                >
                                    <h2 className="text-xl font-bold text-black mb-6 flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <span>Informations Personnelles</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                value={userProfile?.name || ''}
                                                readOnly
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Adresse e-mail
                                            </label>
                                            <input
                                                type="email"
                                                value={userProfile?.email || ''}
                                                readOnly
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50"
                                                placeholder="Votre adresse e-mail"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                Adresse de livraison
                                            </label>
                                            <textarea
                                                value={effectiveDeliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-20"
                                                placeholder="Saisissez votre adresse complète"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <CoffeeSelector />

                                <PaymentSelector />

                                <DeliverySelector />

                                <motion.button
                                    onClick={showOrderConfirm}
                                    disabled={isProcessing || !selectedCoffee || !selectedPayment || !selectedDelivery}
                                    className={`
                                        w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300
                                        ${isProcessing || !selectedCoffee || !selectedPayment || !selectedDelivery
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center">
                                            <LoadingSpinner message="Préparation..." size="sm" />
                                        </div>
                                    ) : (
                                        'Passer la commande'
                                    )}
                                </motion.button>

                                {(selectedCoffee || selectedDelivery || selectedPayment) && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-black mb-4">Récapitulatif</h3>

                                        {selectedCoffee && (
                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                        <img
                                                            src={selectedCoffee.image}
                                                            alt={selectedCoffee.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-black">{selectedCoffee.name}</h4>
                                                        <p className="text-sm text-gray-600">{selectedCoffee.description}</p>
                                                        <p className="text-lg font-bold text-blue-600 mt-1">
                                                            {selectedCoffee.cost?.toLocaleString('fr-FR') || '0'} MGA
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedDelivery && (
                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Truck className="w-5 h-5 text-green-600" />
                                                        <span className="text-gray-700">{selectedDelivery.name}</span>
                                                    </div>
                                                    <span className="font-bold text-green-600">
                                                        +{selectedDelivery.price.toLocaleString('fr-FR')} MGA
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {selectedCoffee && selectedDelivery && (
                                            <div className="pt-4 border-t border-gray-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-black">Total</span>
                                                    <span className="text-xl font-bold text-green-600">
                                                        {totalCost.toLocaleString('fr-FR')} MGA
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'delivery' && currentOrder && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-6xl mb-6"
                                >
                                    {currentOrder.delivery?.type === 'bike' && '🚲'}
                                    {currentOrder.delivery?.type === 'motorcycle' && '🏍️'}
                                    {currentOrder.delivery?.type === 'truck' && '🚚'}
                                    {currentOrder.delivery?.type === 'ship' && '🚢'}
                                </motion.div>

                                <h2 className="text-2xl font-bold text-black mb-4">
                                    Livraison en cours
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Votre commande #{currentOrder.id.slice(0, 8).toUpperCase()} est en route
                                </p>

                                <LoadingSpinner message="Préparation et livraison en cours..." size="lg" />

                                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">De</span>
                                        <span className="font-medium">CoffeeMachine Pro</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vers</span>
                                        <span className="font-medium text-right">{effectiveDeliveryAddress}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => showInfoToast('Votre café arrive bientôt! Suivi en temps réel activé.')}
                                    className="mt-6 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Suivre la livraison
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'payment' && currentOrder && selectedPayment && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white border border-gray-200 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-black mb-6 text-center">
                                    Finaliser le paiement
                                </h2>

                                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                                    <h3 className="font-bold text-black mb-4">Détails de la commande</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Café</span>
                                            <span className="font-medium">{currentOrder.coffee.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Livraison</span>
                                            <span className="font-medium">{currentOrder.delivery?.name || 'Non spécifiée'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mode de paiement</span>
                                            <span className="font-medium">{selectedPayment.name}</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold text-black">Total à payer</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    {(currentOrder.coffee.cost + (currentOrder.delivery?.price || 0)).toLocaleString('fr-FR')} MGA
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-bold text-black mb-4">Informations de paiement</h3>

                                    {selectedPayment.type === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Numéro de carte
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Date d'expiration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/AA"
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment.type === 'mobile' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Numéro de téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={mobileNumber}
                                                    onChange={(e) => setMobileNumber(e.target.value)}
                                                    placeholder="+261 34 12 345 67"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Code secret
                                                </label>
                                                <input
                                                    type="password"
                                                    value={secretCode}
                                                    onChange={(e) => setSecretCode(e.target.value)}
                                                    placeholder="••••••"
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment.type === 'cash' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Montant en espèces
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={cashAmount}
                                                        onChange={(e) => setCashAmount(e.target.value)}
                                                        placeholder={`${(currentOrder.coffee.cost + (currentOrder.delivery?.price || 0)).toLocaleString('fr-FR')} MGA`}
                                                        min={currentOrder.coffee.cost + (currentOrder.delivery?.price || 0)}
                                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                    />
                                                    <span className="absolute left-3 top-2 text-gray-500">Ar</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Le montant minimum est de {(currentOrder.coffee.cost + (currentOrder.delivery?.price || 0)).toLocaleString('fr-FR')} MGA
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={cancelOrder}
                                        className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        <span>Payer maintenant</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'order' && !currentOrder && !selectedCoffee && !selectedPayment && !selectedDelivery && (
                        <div className="text-center py-12">
                            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucune commande en cours</h3>
                            <p className="text-gray-500">
                                Sélectionnez vos options ci-dessus pour commencer une nouvelle commande
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showConfirmModal}
                onRequestClose={() => setShowConfirmModal(false)}
                contentLabel="Confirmer la commande"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Confirmer la commande
                        </h2>
                        <p className="text-gray-600">
                            Voulez-vous vraiment passer cette commande ?
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Café</span>
                                <span className="font-medium">{selectedCoffee?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Livraison</span>
                                <span className="font-medium">{selectedDelivery?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Paiement</span>
                                <span className="font-medium">{selectedPayment?.name}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-green-600">
                                        {totalCost.toLocaleString('fr-FR')} MGA
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleOrder}
                            className="flex-1 py-3 px-6 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Check className="w-5 h-5" />
                            <span>Confirmer</span>
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showCancelModal}
                onRequestClose={() => setShowCancelModal(false)}
                contentLabel="Confirmer l'annulation"
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Annuler la commande
                        </h2>
                        <p className="text-gray-600">
                            Êtes-vous sûr de vouloir annuler cette commande ?
                            Cette action est irréversible.
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Retour
                        </button>
                        <button
                            onClick={confirmCancelOrder}
                            className="flex-1 py-3 px-6 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Annuler la commande
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};