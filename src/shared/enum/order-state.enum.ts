// Order Status
export enum OrderStateType {
  PENDING = 'pending', // 1. Pending ,  order failed,
  PROCESSING = 'processing', // 1. allow cancellation
  SHIPPED = 'shipped', // 3. not able to cancel, but can return
  COMPLETED = 'completed', // 4. Completed
  CANCELLED = 'cancelled', // 5. Cancel
  CLOSED = 'closed', // 6. Closed
  RETURN = 'return', // 7. Return
}
