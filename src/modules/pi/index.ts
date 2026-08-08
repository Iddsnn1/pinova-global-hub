import { createPiPayment, authenticatePiUser } from '../../lib/piSdk';

export interface IPiPaymentRequest {
  amountPi: number;
  memo: string;
  metadata: Record<string, any>;
}

export class PiIntegrationModule {
  async authenticateUser() {
    return await authenticatePiUser();
  }

  async processPayment(request: IPiPaymentRequest) {
    return await createPiPayment({
      amountPi: request.amountPi,
      memo: request.memo,
      metadata: request.metadata
    });
  }
}

export const piIntegration = new PiIntegrationModule();
