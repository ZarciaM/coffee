import { create } from 'zustand';
import { apiService } from '../services/api';
import type { Coffee } from '../types/coffee';
import type { PaymentMethod } from '../types/paymentMethod';
import type { DeliveryMethod } from '../types/deliveryMethod';
import type { Order } from '../types/order';
import type { ApiDelivery, Vehicle, PaymentHistory as ApiPaymentHistory } from '../types/api-types';

interface OrdersSummary {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    address: string;
}

const STATIC_PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Carte bancaire',
        type: 'card',
        icon: '💳',
        available: true
    },
    {
        id: 'mobile',
        name: 'Mobile Money',
        type: 'mobile',
        icon: '📱',
        available: true
    },
    {
        id: 'cash',
        name: 'Espèces',
        type: 'cash',
        icon: '💰',
        available: true
    }
];

const mapVehicleType = (vehicleName: string): 'bike' | 'motorcycle' | 'truck' | 'ship' => {
    const name = vehicleName.toLowerCase();
    if (name.includes('bike')) return 'bike';
    if (name.includes('moto') || name.includes('motorcycle')) return 'motorcycle';
    if (name.includes('truck')) return 'truck';
    if (name.includes('van')) return 'truck';
    return 'ship';
};

const getVehicleIcon = (vehicleName: string): string => {
    const name = vehicleName.toLowerCase();
    if (name.includes('bike')) return '🚲';
    if (name.includes('moto') || name.includes('motorcycle')) return '🏍️';
    if (name.includes('truck')) return '🚚';
    if (name.includes('van')) return '🚐';
    return '🚗';
};

type OrderStatus = 'pending' | 'brewing' | 'paying' | 'delivering' | 'completed';

const toOrderStatus = (status: string): OrderStatus => {
    const validStatuses: OrderStatus[] = ['pending', 'brewing', 'paying', 'delivering', 'completed'];
    return validStatuses.includes(status as OrderStatus) ? status as OrderStatus : 'pending';
};

interface OrderStore {
    selectedCoffee: Coffee | null;
    selectedPayment: PaymentMethod | null;
    selectedDelivery: DeliveryMethod | null;
    currentOrder: Order | null;
    isProcessing: boolean;
    orderHistory: Order[];
    coffees: Coffee[];
    payments: PaymentMethod[];
    deliveries: DeliveryMethod[];
    loading: boolean;
    userProfile: UserProfile | null;
    paymentHistory: ApiPaymentHistory[];
    loadingPayments: boolean;

    setSelectedCoffee: (coffee: Coffee) => void;
    setSelectedPayment: (payment: PaymentMethod) => void;
    setSelectedDelivery: (delivery: DeliveryMethod) => void;
    startOrder: () => Promise<Order | null>;
    updateOrderStatus: (status: OrderStatus) => Promise<void>;
    completeOrder: () => Promise<void>;
    resetOrder: () => void;
    fetchCoffees: () => Promise<void>;
    fetchPayments: () => Promise<void>;
    fetchDeliveries: () => Promise<void>;
    fetchOrderHistory: () => Promise<void>;
    fetchActiveOrder: () => Promise<void>;
    fetchUserProfile: () => Promise<void>;
    simulateOrderProgress: (orderId: string) => Promise<void>;
    getAnalytics: () => Promise<OrdersSummary | null>;
    fetchPaymentHistory: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    selectedCoffee: null,
    selectedPayment: null,
    selectedDelivery: null,
    currentOrder: null,
    isProcessing: false,
    orderHistory: [],
    coffees: [],
    payments: STATIC_PAYMENT_METHODS,
    deliveries: [],
    loading: false,
    userProfile: null,
    paymentHistory: [],
    loadingPayments: false,

    setSelectedCoffee: (coffee) => set({ selectedCoffee: coffee }),

    setSelectedPayment: (payment) => set({ selectedPayment: payment }),

    setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),

    startOrder: async () => {
        const { selectedCoffee, selectedPayment, selectedDelivery } = get();

        if (!selectedCoffee || !selectedPayment || !selectedDelivery) {
            alert('Veuillez sélectionner un café, un mode de paiement et une livraison');
            return null;
        }

        try {
            set({ isProcessing: true });

            const orderData = {
                coffeeId: selectedCoffee.id,
                paymentId: selectedPayment.id,
                deliveryId: selectedDelivery.id,
                status: 'pending',
                totalPrice: (selectedCoffee.cost || 0) + (selectedDelivery.price || 0),
            };

            console.log('Creating order with data:', orderData);
            const response = await apiService.createOrder(orderData);
            console.log('Order created:', response);

            const order: Order = {
                ...response,
                status: toOrderStatus(response.status),
                createdAt: new Date(response.createdAt || new Date()),
                coffee: selectedCoffee,
                payment: selectedPayment,
                delivery: selectedDelivery,
            };

            set({
                currentOrder: order,
                isProcessing: false
            });

            get().simulateOrderProgress(order.id);

            return order;
        } catch (error) {
            console.error('Failed to create order:', error);
            set({ isProcessing: false });
            alert('Erreur lors de la création de la commande');
            return null;
        }
    },

    updateOrderStatus: async (status: OrderStatus) => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        try {
            const response = await apiService.updateOrderStatus(currentOrder.id, status);
            console.log('Backend status update response:', response);

            const updatedOrder: Order = {
                ...currentOrder,
                status: toOrderStatus(response.status),
            };

            set({
                currentOrder: updatedOrder,
            });
        } catch (error) {
            console.error('Failed to update order status on backend:', error);

            console.log('Updating order status locally only:', status);
            const updatedOrder: Order = {
                ...currentOrder,
                status: status,
            };
            set({
                currentOrder: updatedOrder,
            });
        }
    },

    completeOrder: async () => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        try {
            await apiService.updateOrderStatus(currentOrder.id, 'delivering');

            const deliveringOrder: Order = {
                ...currentOrder,
                status: 'delivering',
            };

            set({
                currentOrder: deliveringOrder,
                isProcessing: false,
            });

            setTimeout(() => {
                get().simulateOrderProgress(deliveringOrder.id);
            }, 2000);

        } catch (error) {
            console.error('Failed to complete order:', error);
        }
    },

    resetOrder: () => {
        set({
            selectedCoffee: null,
            selectedPayment: null,
            selectedDelivery: null,
            currentOrder: null,
            isProcessing: false,
        });
    },

    fetchCoffees: async () => {
        try {
            set({ loading: true });
            const response = await apiService.getCoffees();
            console.log('Fetched coffees:', response);
            set({ coffees: response, loading: false });
        } catch (error) {
            console.error('Failed to fetch coffees:', error);
            set({ loading: false });
        }
    },

    fetchPayments: async () => {
        console.log('Using static payments:', STATIC_PAYMENT_METHODS);
        set({ payments: STATIC_PAYMENT_METHODS });
    },

    fetchDeliveries: async () => {
        try {
            const response = await apiService.getDeliveries();
            console.log('API deliveries response:', response);

            // Type assertion pour indiquer que response est ApiDelivery[]
            const apiDeliveries = response as unknown as ApiDelivery[];
            
            const deliveries: DeliveryMethod[] = apiDeliveries.flatMap((delivery: ApiDelivery) =>
                delivery.vehicles.map((vehicle: Vehicle) => ({
                    id: vehicle.id,
                    name: vehicle.name,
                    type: mapVehicleType(vehicle.name),
                    price: vehicle.price,
                    estimatedTime: (delivery.duration - vehicle.timeGain) * 60000,
                    icon: getVehicleIcon(vehicle.name)
                }))
            );

            console.log('Transformed deliveries:', deliveries);
            set({ deliveries });
        } catch (error) {
            console.error('Failed to fetch deliveries from API:', error);
            console.log('No deliveries available - API error');
            set({ deliveries: [] });
        }
    },

    fetchOrderHistory: async () => {
        try {
            const response = await apiService.getOrders();
            console.log('Fetched order history:', response);
            const orders: Order[] = response.map((order: Order) => ({
                ...order,
                status: toOrderStatus(order.status),
                createdAt: new Date(order.createdAt || new Date()),
            }));
            set({ orderHistory: orders });
        } catch (error) {
            console.error('Failed to fetch order history:', error);
        }
    },

    fetchActiveOrder: async () => {
        try {
            const response = await apiService.getActiveOrders();
            console.log('Fetched active orders:', response);
            if (response && response.length > 0) {
                const activeOrder: Order = {
                    ...response[0],
                    status: toOrderStatus(response[0].status),
                    createdAt: new Date(response[0].createdAt || new Date()),
                };
                set({ currentOrder: activeOrder });

                if (activeOrder.status !== 'completed') {
                    get().simulateOrderProgress(activeOrder.id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch active order:', error);
        }
    },

    fetchUserProfile: async () => {
        try {
            const response = await apiService.getUserProfile();
            console.log('Fetched user profile from API:', response);

            let userData = response;
            if (Array.isArray(response) && response.length > 0) {
                userData = response[0];
            } else if (Array.isArray(response)) {
                throw new Error('Aucun utilisateur trouvé');
            }

            const userProfile: UserProfile = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                address: userData.address
            };

            console.log('Processed user profile:', userProfile);
            set({ userProfile });
        } catch (error) {
            console.error('Failed to fetch user profile from API:', error);
            set({ userProfile: null });
        }
    },

    simulateOrderProgress: async (orderId: string) => {
        const { currentOrder } = get();
        if (!currentOrder || currentOrder.status === 'completed') return;

        const statusSequence: OrderStatus[] = ['pending', 'brewing', 'paying', 'delivering', 'completed'];
        const currentIndex = statusSequence.indexOf(currentOrder.status as OrderStatus);

        if (currentIndex < statusSequence.length - 1) {
            const nextStatus = statusSequence[currentIndex + 1];

            if (nextStatus === 'delivering' && currentOrder.status === 'paying') {
                console.log('En attente du paiement utilisateur...');
                return;
            }

            setTimeout(async () => {
                try {
                    console.log(`Simulating order progress: ${currentOrder.status} -> ${nextStatus}`);

                    await get().updateOrderStatus(nextStatus);

                    if (nextStatus !== 'paying' && nextStatus !== 'completed') {
                        get().simulateOrderProgress(orderId);
                    }
                } catch (error) {
                    console.error('Failed to simulate order progress:', error);
                }
            }, 5000);
        }
    },

    getAnalytics: async () => {
        try {
            const summary = await apiService.getOrdersSummary();
            return summary;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            return null;
        }
    },

    fetchPaymentHistory: async () => {
        try {
            set({ loadingPayments: true });
            const response = await apiService.getPaymentHistory();
            console.log('Fetched payment history:', response);

            const paymentHistory: ApiPaymentHistory[] = response.map((payment: ApiPaymentHistory) => ({
                id: payment.id,
                paymentDate: payment.paymentDate,
                transactionReference: payment.transactionReference || `PAY-${payment.id.slice(0, 8)}`,
                totalAmount: payment.totalAmount,
                phoneNumber: payment.phoneNumber,
                secretCode: payment.secretCode,
                cardNumber: payment.cardNumber,
                amount: payment.amount,
                delivery: payment.delivery,
                coffeeOrder: payment.coffeeOrder,
                method: payment.method || 'card',
                status: payment.status || 'completed'
            }));

            set({ paymentHistory, loadingPayments: false });
        } catch (error) {
            console.error('Failed to fetch payment history:', error);
            set({ paymentHistory: [], loadingPayments: false });
        }
    },
}));