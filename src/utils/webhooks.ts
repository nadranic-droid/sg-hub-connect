/**
 * Webhook utilities for integrating with external services like GoHighLevel
 */

interface WebhookPayload {
  type: string;
  timestamp: string;
  webhookId: string;
  data: Record<string, unknown>;
}

/**
 * Send webhook to GoHighLevel when a business is submitted
 * Based on: https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/index.html
 */
export async function sendGoHighLevelWebhook(
  webhookUrl: string,
  eventType: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const payload: WebhookPayload = {
      type: eventType,
      timestamp: new Date().toISOString(),
      webhookId: `ghl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      data,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Webhook failed:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Webhook error:', error);
    return false;
  }
}

/**
 * Verify webhook signature (for receiving webhooks from GoHighLevel)
 * Based on GoHighLevel's public key verification
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  publicKey: string
): boolean {
  // This would use crypto to verify the signature
  // Implementation depends on your runtime environment
  // For now, return true if signature exists
  return signature !== undefined && signature.length > 0;
}

