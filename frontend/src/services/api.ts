import type { Coffee } from '../types/coffee';
import type { Order } from '../types/order';
import type { PaymentMethod } from '../types/paymentMethod';
import type { ApiDelivery, CoffeeOrder, PaymentHistory } from '../types/api-types';

interface ApiUserProfile {
    id: string;
    name: string;
    email: string;
    address: string;
}

interface OrdersSummary {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

interface CreateOrderData {
    coffeeId: string;
    paymentId: string;
    deliveryId: string;
    status: string;
    totalPrice: number;
}

interface UserStats {
    userId: string;
    totalOrders: number;
    totalSpent: number;
    favoriteCoffee: string;
    lastOrderDate: string;
}

interface ApiOrderStatus {
    id: string;
    status: string;
    statusDate: string;
    coffeeOrder?: CoffeeOrder;
}

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `API Error: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown error occurred');
        }
    }

    async getCoffees(): Promise<Coffee[]> {
        return this.request<Coffee[]>('/api/coffee');
    }

    async getPayments(): Promise<PaymentMethod[]> {
        return this.request<PaymentMethod[]>('/api/payments');
    }

    async getDeliveries(): Promise<ApiDelivery[]> {
        return this.request<ApiDelivery[]>('/api/delivery');
    }

    async createOrder(orderData: CreateOrderData): Promise<Order> {
        return this.request<Order>('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders(): Promise<Order[]> {
        return this.request<Order[]>('/api/orders');
    }

    async getOrderById(id: string): Promise<Order> {
        return this.request<Order>(`/api/orders/${id}`);
    }

    async updateOrderStatus(id: string, status: string): Promise<ApiOrderStatus> {
        const url = `/api/orders/${id}/status?status=${encodeURIComponent(status)}`;
        return this.request<ApiOrderStatus>(url, {
            method: 'PATCH',
        });
    }

    async getActiveOrders(): Promise<Order[]> {
        return this.request<Order[]>('/api/orders/active');
    }

    async getUserProfile(): Promise<ApiUserProfile> {
        return this.request<ApiUserProfile>('/api/users');
    }

    async getOrdersSummary(): Promise<OrdersSummary> {
        return this.request<OrdersSummary>('/api/analytics/orders-summary');
    }

    async getUserStats(userId: string): Promise<UserStats> {
        return this.request<UserStats>(`/api/analytics/user-stats/${userId}`);
    }

    async getPaymentHistory(): Promise<PaymentHistory[]> {
        return this.request<PaymentHistory[]>('/api/payments');
    }

    async simulateBrew(orderId: string): Promise<Order> {
        try {
            await this.updateOrderStatus(orderId, 'brewing');

            return this.getOrderById(orderId);
        } catch {
            console.warn('Brew simulation endpoint not available, using local simulation');
            return this.getOrderById(orderId);
        }
    }

    async simulateDeliver(orderId: string): Promise<Order> {
        try {
            await this.updateOrderStatus(orderId, 'delivering');

            return this.getOrderById(orderId);
        } catch {
            console.warn('Deliver simulation endpoint not available, using local simulation');
            return this.getOrderById(orderId);
        }
    }
}

export const apiService = new ApiService();