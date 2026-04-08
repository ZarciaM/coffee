import React, { useEffect } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import '../orderProgress.css';

export const OrderProgress: React.FC = () => {
    const { currentOrder, fetchActiveOrder } = useOrderStore();

    const steps = [
        { name: 'Commande', status: 'pending' },
        { name: 'Préparation', status: 'brewing' },
        { name: 'Paiement', status: 'paying' },
        { name: 'Livraison', status: 'delivering' },
        { name: 'Terminé', status: 'completed' }
    ];

    useEffect(() => {
        if (!currentOrder) {
            fetchActiveOrder();
        }
    }, [currentOrder, fetchActiveOrder]);

    if (!currentOrder) {
        return (
            <div className="order-progress-container">
                <div className="text-center py-8">
                    <p className="text-gray-500">Aucune commande en cours</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = steps.findIndex(step => step.status === currentOrder.status);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;
    const totalPrice = currentOrder.coffee.cost + (currentOrder.delivery?.price || 0);

    return (
        <div className="order-progress-container">
            <h2 className="order-progress-title">Votre commande en cours</h2>
            <p className="text-sm text-gray-600 mb-4">ID: #{currentOrder.id}</p>

            <div className="progress-container">
                <div className="progress-header">
                    <span className="progress-label">Progression</span>
                    <span className="progress-percentage">{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="steps-container">
                {steps.map((step, index) => (
                    <div key={step.name} className="step-item">
                        <div
                            className={`step-circle ${index <= currentStepIndex ? 'step-active' : 'step-inactive'}`}
                            aria-label={`Étape ${index + 1}: ${step.name}`}
                        >
                            {index + 1}
                        </div>
                        <span className="step-name">{step.name}</span>
                        {index === currentStepIndex && (
                            <span className="text-xs text-blue-600 font-medium mt-1">
                                En cours...
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="order-details-grid">
                <div className="order-detail-card">
                    <h3 className="order-detail-title">Café</h3>
                    <div className="order-detail-content">
                        <div className="order-detail-image">
                            <img
                                src={currentOrder.coffee.image}
                                alt={currentOrder.coffee.name}
                                loading="lazy"
                            />
                        </div>
                        <div className="order-detail-text">
                            <p className="order-detail-name">{currentOrder.coffee.name}</p>
                            <p className="order-detail-price">{currentOrder.coffee.cost?.toLocaleString('fr-FR') || '0'} MGA</p>
                        </div>
                    </div>
                </div>

                {currentOrder.payment && (
                    <div className="order-detail-card">
                        <h3 className="order-detail-title">Paiement</h3>
                        <div className="order-detail-content">
                            <span className="order-detail-icon" role="img" aria-label={currentOrder.payment.name}>
                                {currentOrder.payment.icon}
                            </span>
                            <div className="order-detail-text">
                                <p className="order-detail-name">{currentOrder.payment.name}</p>
                                <p className="order-detail-description">
                                    {currentOrder.payment.type === 'card' && 'Carte bancaire'}
                                    {currentOrder.payment.type === 'mobile' && 'Mobile Money'}
                                    {currentOrder.payment.type === 'cash' && 'Espèces'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {currentOrder.delivery && (
                    <div className="order-detail-card">
                        <h3 className="order-detail-title">Livraison</h3>
                        <div className="order-detail-content">
                            <span className="order-detail-icon" role="img" aria-label={currentOrder.delivery.name}>
                                {currentOrder.delivery.icon}
                            </span>
                            <div className="order-detail-text">
                                <p className="order-detail-name">{currentOrder.delivery.name}</p>
                                <p className="order-detail-price">
                                    +{currentOrder.delivery.price.toLocaleString('fr-FR')} MGA
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="order-total-container">
                <span className="order-total-label">Total</span>
                <span className="order-total-amount">
                    {totalPrice.toLocaleString('fr-FR')} MGA
                </span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Commande créée le {new Date(currentOrder.createdAt).toLocaleString()}
            </div>
        </div>
    );
};