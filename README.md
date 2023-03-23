# catch-optometrist-vacant-date
Small script to repetitively poll government site for free terms on given doctor specialization

TODO:
1. make a docker image containing following:
[x] curl
[x] pup binary
[x] node.js


2. make express.js server
[ ] make **endpoint** to receive subscription data from the browser client
[ ] generate a set of server keys (trustworthily identifying The Server entity)

3. make client code
[x] find out: ? how to pass the server's public key to the client ?
[x] request user to subscribe to the server's notifications
[x] create service worker
[x] show notification to the user from the service worker level
[x] Understand how service worker is reloaded in the browser
[ ] Find out: ? how to show notifications only after the user has given consent ?
[x] Subscribe in the browser the push notifications from yur home server
