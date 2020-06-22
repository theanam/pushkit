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
// https://github.com/theanam/pushkit/pull/2
declare class PushKit {
  constructor(
    publickKey: string,
    verbose?: bolean
  );
}