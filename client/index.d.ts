export as namespace PushKitClient;

interface PushKitClientInstance {
  supported: boolean;
  subscribed: boolean;
  key: string;
  reg?: ServiceWorkerRegistration;
  sub?: PushSubscription;
  handleRegistration(
    reg: ServiceWorkerRegistration
  ): Promise<PushSubscription | null>;
}

export = {PushKit};

declare function PushKit(
  publickKey: string,
  verbose?: boolean
): PushKitClientInstance;
