export as namespace PushKitClient;

export = {PushKit};

declare class PushKit {
  constructor(
    publickKey: string,
    verbose?: boolean
  );
  supported: boolean;
  subscribed: boolean;
  key: string;
  reg?: ServiceWorkerRegistration;
  sub?: PushSubscription;
  handleRegistration(
    reg: ServiceWorkerRegistration
  ): Promise<PushSubscription | null>;
}
