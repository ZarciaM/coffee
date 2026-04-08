export const ORDER_STATUS = {
    PENDING: 'pending',
    BREWING: 'brewing',
    PAYING: 'paying',
    DELIVERING: 'delivering',
    COMPLETED: 'completed',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];