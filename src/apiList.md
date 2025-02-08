## AuthRouter

POST /signUp
POST /Login
POST /Logout

## UserRouter

GET /feed
GET /connections
GET /requests

## ProfileRouter

GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## ConnectionRequestRouter

POST request/send/interested/:userId
POST request/send/ignored/:userId
POST request/review/accept/:requestId
POST request/review/reject/:requestId
