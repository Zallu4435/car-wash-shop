import { apiClient } from '@/api/client';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!isPushSupported()) return 'unsupported';
    return Notification.permission;
}

/**
 * Register service worker
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
        console.log('Service workers not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
    }
}

/**
 * Convert URL-safe base64 to Uint8Array (required for applicationServerKey)
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<{ success: boolean; error?: string }> {
    if (!isPushSupported()) {
        return { success: false, error: 'Push notifications not supported' };
    }

    if (!VAPID_PUBLIC_KEY) {
        return { success: false, error: 'VAPID public key not configured' };
    }

    try {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return { success: false, error: 'Notification permission denied' };
        }

        // Register service worker
        const registration = await registerServiceWorker();
        if (!registration) {
            return { success: false, error: 'Failed to register service worker' };
        }

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Check for existing subscription
        let subscription = await registration.pushManager.getSubscription();

        // If no subscription, create one
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as ArrayBuffer
            });
        }

        // Send subscription to backend
        await apiClient.post('/notifications/push/subscribe', {
            subscription: subscription.toJSON()
        });

        console.log('Push subscription saved');
        return { success: true };
    } catch (error) {
        console.error('Push subscription error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to subscribe'
        };
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<{ success: boolean; error?: string }> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // Notify backend
            await apiClient.post('/notifications/push/unsubscribe', {
                endpoint: subscription.endpoint
            });

            // Unsubscribe locally
            await subscription.unsubscribe();
        }

        return { success: true };
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to unsubscribe'
        };
    }
}

/**
 * Check if currently subscribed to push
 */
export async function isSubscribedToPush(): Promise<boolean> {
    if (!isPushSupported()) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return !!subscription;
    } catch {
        return false;
    }
}
