// Service Worker for Web Push Notifications

self.addEventListener('push', function (event) {
    if (!event.data) {
        console.log('Push event but no data');
        return;
    }

    const data = event.data.json();

    const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon || '/images/logo.png',
        badge: data.badge || '/images/badge.png',
        vibrate: [100, 50, 100],
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false,
        tag: data.tag || 'easywash-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'EasyWash', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const data = event.notification.data;
    let url = '/';

    if (data && data.actionUrl) {
        url = data.actionUrl;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // If a window is already open, focus it and navigate
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if ('focus' in client) {
                        client.focus();
                        if ('navigate' in client) {
                            client.navigate(url);
                        }
                        return;
                    }
                }
                // Otherwise open a new window
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

self.addEventListener('notificationclose', function (event) {
    // Optional: track notification dismissals
    console.log('Notification closed', event.notification.tag);
});
