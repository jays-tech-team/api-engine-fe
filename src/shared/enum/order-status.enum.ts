// Order Status
export enum OrderStatusEnum {
  /** Pending state */
  DRAFT = 'draft', // Order is draft - not completed the order
  QUOTE = 'quote', // Order is quote (Quote amount is set by shop manager)
  QUOTE_CONFIRMED = 'quote-confirmed', // Order is quote confirmed (Quote amount is confirmed by shop manager)
  PENDING = 'pending', // Order is pending
  PAYMENT_FAILED = 'payment-failed', // Order payment failed
  AWAITING_PAYMENT_LINK = 'awaiting-payment-link', // Order is awaiting payment link
  WAITING_FOR_ADDRESS_COLLECTION = 'waiting-for-address-collection', // Order is waiting for address collection, This is only for pickup orders
  CONFIRMED = 'confirmed', // Order is confirmed or after the payment

  /** Processing state */
  PROCESSING = 'processing', // Order is processing
  PREPARING_ORDER = 'preparing-order', // Order is preparing
  PREPARATION_COMPLETED = 'preparation-completed', // Order is preparation completed
  QUALITY_CHECK_IN_PROGRESS = 'quality-check-in-progress', // Order is quality check in progress
  QUALITY_CHECK_PASSED = 'quality-check-passed', // Order is quality check passed
  QUALITY_CHECK_FAILED = 'quality-check-failed', // Order is quality check failed,
  CUSTOMER_APPROVED = 'customer-approved', // Order items QA approved by customer
  CHANGE_REQUEST = 'change-request', // Order is change request
  CHANGE_REQUEST_CLOSED = 'change-request-closed',

  /** Shipped state */
  SHIPPED = 'shipped', // Order is shipped
  IN_TRANSIT = 'in-transit', // Order is in transit
  OUT_FOR_DELIVERY = 'out-for-delivery', // Order is out for delivery
  READY_FOR_PICKUP = 'ready-for-pickup', // Order is ready for pickup
  DELIVERY_COMPLETED = 'delivery-completed', // Order is delivery completed
  PARTIALLY_COMPLETED = 'partially-completed', // Order is partially completed

  /** Return state */
  DELIVERY_FAILED = 'delivery-failed', // Order is delivery failed
  DELIVERY_RETURN_INITIATED = 'delivery-return-initiated', // Order is delivery return initiated
  DELIVERY_RETURN_COLLECTED = 'delivery-return-collected', // Order is delivery return collected
  DELIVERY_RETURN_COMPLETED = 'delivery-return-completed', // Order is delivery return completed

  /** Completed state */
  ORDER_COMPLETED = 'order-completed', // Order is completed
  /** Cancelled state */
  ORDER_CANCELLED = 'order-cancelled', // Order is cancelled
  ORDER_CANCELLATION_REQUESTED = 'order-cancellation-requested', // Order is cancellation requested

  /** Closed state */
  ORDER_CLOSED = 'order-closed', // Order is closed
  ORDER_REFUNDED = 'order-refunded', // Order is refunded
}
