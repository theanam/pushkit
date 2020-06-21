import * as WebPush from "web-push";

export as namespace PushKitServer;

export = createSender;

declare function createSender(
  keys: WebPush.VapidKeys,
  email: string
): PushKitSender;

interface PushKitSender {
  webPush: typeof import('web-push');
  send(
    subscription: PushSubscription,
    message: string | Buffer
  ): Promise<WebPush.SendResult>;
}
