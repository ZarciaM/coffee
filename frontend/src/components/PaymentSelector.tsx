import React from 'react';
import { STATIC_PAYMENT_METHODS } from '../types/paymentMethod';
import { useOrderStore } from '../store/useOrderStore';

export const PaymentSelector: React.FC = () => {
    const { selectedPayment, setSelectedPayment } = useOrderStore();
    const payments = STATIC_PAYMENT_METHODS;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mode de paiement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {payments.map(payment => (
                    <div
                        key={payment.id}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${selectedPayment?.id === payment.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => setSelectedPayment(payment)}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{payment.icon}</span>
                            <div>
                                <h3 className="font-semibold text-gray-800">{payment.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {payment.type === 'card' && 'Paiement sécurisé'}
                                    {payment.type === 'mobile' && 'Paiement mobile'}
                                    {payment.type === 'cash' && 'Paiement en espèces'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};