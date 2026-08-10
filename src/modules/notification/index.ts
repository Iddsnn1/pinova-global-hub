import type { Notification as AppNotification } from '../../types';

import { safeFetchJson } from '../../lib/safeFetch';

export interface NotificationPayload {
  title: string;
  message: string;
  type: AppNotification['type'];
  recipientId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface INotificationAdapter {
  channelName: string;
  send(payload: NotificationPayload): Promise<{ success: boolean; channel: string; timestamp: string }>;
}

export class InAppNotificationAdapter implements INotificationAdapter {
  channelName = 'In-App';

  async send(payload: NotificationPayload) {
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class PushNotificationAdapter implements INotificationAdapter {
  channelName = 'Push (Pi Browser)';

  async send(payload: NotificationPayload) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(payload.title, { body: payload.message });
      } catch (e) {
        console.warn('Push notification dispatch note:', e);
      }
    }
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class EmailNotificationAdapter implements INotificationAdapter {
  channelName = 'Email Gateway (Future Service)';

  async send(payload: NotificationPayload) {
    console.log(`[Email Adapter Queued] To: ${payload.recipientEmail || 'user@pinova.net'} | Subject: ${payload.title}`);
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class SMSNotificationAdapter implements INotificationAdapter {
  channelName = 'SMS Telephony Gateway (Future Service)';

  async send(payload: NotificationPayload) {
    console.log(`[SMS Adapter Queued] To: ${payload.recipientPhone || '+1-000-000-0000'} | Body: ${payload.message}`);
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class WhatsAppNotificationAdapter implements INotificationAdapter {
  channelName = 'WhatsApp Business API (Future Service)';

  async send(payload: NotificationPayload) {
    console.log(`[WhatsApp Adapter Queued] Message: ${payload.title} - ${payload.message}`);
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class WebhookNotificationAdapter implements INotificationAdapter {
  channelName = 'HTTP Webhook Relay';

  async send(payload: NotificationPayload) {
    try {
      await safeFetchJson('/api/v1/pstp/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'NOTIFICATION_WEBHOOK_DISPATCH',
          severity: 'info',
          description: `Notification dispatched: ${payload.title}`
        })
      });
    } catch (e) {
      console.warn('Webhook notification log notice:', e);
    }
    return {
      success: true,
      channel: this.channelName,
      timestamp: new Date().toISOString()
    };
  }
}

export class NotificationDispatcher {
  private adapters: INotificationAdapter[] = [
    new InAppNotificationAdapter(),
    new PushNotificationAdapter(),
    new EmailNotificationAdapter(),
    new SMSNotificationAdapter(),
    new WhatsAppNotificationAdapter(),
    new WebhookNotificationAdapter()
  ];

  async dispatch(payload: NotificationPayload) {
    const results = await Promise.all(this.adapters.map((adapter) => adapter.send(payload)));
    return results;
  }
}

export class NotificationModule {
  private dispatcher = new NotificationDispatcher();

  createNotification(
    type: AppNotification['type'],
    title: string,
    message: string,
    link?: string
  ): AppNotification {
    const notif: AppNotification = {
      id: `NTF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      link
    };

    // Trigger multi-channel adapter broadcast asynchronously
    this.dispatcher.dispatch({ title, message, type, link }).catch(console.warn);

    return notif;
  }
}

export const notificationModule = new NotificationModule();
