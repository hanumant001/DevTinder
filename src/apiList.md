# DevTinder API's

**authRouter**
- POST/signup
- POST/login
- POST/logout

**ProfileRouter**
-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password

**connectionRequestRourter**
- POST/request/send/interested/:userId
- POST//request/send/ignored/:userId
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

**userRouter**
-GET/user/connection
-GET/user/requests
-GET/user/feed // Gets you the profile of other users on platform

Status : ignore,interested,accepted,rejected
