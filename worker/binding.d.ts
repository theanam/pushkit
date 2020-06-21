export as namespace PushKitWorker;

export = attachPushKit;

declare function attachPushKit(
  scope: ServiceWorker,
  config: WorkerConfig,
  verbose?: boolean
): void;

interface WorkerConfig {
  title?: String;
  icon?: String;
  badge?: String;
}
