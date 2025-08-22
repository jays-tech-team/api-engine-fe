export enum PaymentStatusEnum {
  UNSET = 'unset',
  PENDING = 'pending',
  PAID = 'paid',
  UNPAID = 'unpaid',
  REFUNDED = 'refunded',
  REFUND_REQUESTED = 'refund-requested',
  PARTIALLY_REFUNDED = 'partially-refunded',
  FAILED = 'failed',
  GATEWAY_FAILED = 'gateway-failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  ANY = 'any',
}
