# Vitrine

Vitrine is a nodejs application, reading it's data from a mongodb backend. To scale Site3, we should

* replicate the mongodb somehow
* spin up more workers to serve http requests (probably not needed)
* use caching services

# F5

Django application, connects to a postgresql database.

# Users

Django application. Receives ajax calls from Site3. Enqueues udids and listens on the queue to send the ipa link for user.

We can spin up several queue listeners easily, and spin up more celery workers to enqueue with higher throughput
