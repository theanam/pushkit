export as namespace PushKitWorker;

export = attachPushKit;

declare function attachPushKit(
  scope: ServiceWorker,
  config?: PushOption,
  defaultTitle?: String,
  defaultURL?: String,
  verbose?: boolean
): void;

interface PushOption{
  data?: Any,
  badge?: String,
  icon?: String,
  image?: String,
  lang?: String,
  renotify?: Boolean,
  requireInteraction?: Boolean,
  silent?: Boolean,
  tag?: String,
  timestamp?: Number,
  vibrate?:[Number]
}