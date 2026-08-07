import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

self.addEventListener('push', (event) => {
  if (!event.data) return
  const datos = event.data.json()
  event.waitUntil(
    self.registration.showNotification(datos.titulo ?? 'PJC Scout', {
      body: datos.cuerpo ?? '',
      icon: '/icons/pwa-192.png',
      badge: '/icons/pwa-192.png',
      data: { url: datos.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
