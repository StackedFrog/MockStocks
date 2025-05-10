--- API Documentation ---

# Auth Service

## Public
- /auth/login
    - method: post
    - body: json
    - body format:
        email: String
        pwd: String
    - returns:
        token: String

- /auth/register
    - method: post
    - body: json
    - body format:
        email: String
        username: String
        pwd: String
    - returns:
        token: String

- /auth/refresh
    - method: post
    - returns:
        token: String

- /auth/google
   - This is for oauth, the user will click on login with google,
        front end will call this endpoint, it will return a url the user
        should be redirected too
    - method: post
    - returns:
        url: String

- /auth/authorized
    - this is the end point that will be called by google after the user
        gave permissions, should redirect user to there home page (tbd)
    - method: get
    - returns:
        token: String

## Users
user needs to be loged in to have access to these endpoints

if not loged in will sent 401

- /auth/user/logout
    - logs out the user, no new access tokens will be granted, user shoud be
        redirected to home page
    - method: post

- /auth/user/change_pwd
    - changed user pasword
    - method: post
    - body: json
    - body format:
        old_pwd: String
        new_pwd: String

- /auth/user/logout_all
    - logsout user from all devices including the current one
    - method: post


## Admin
only accessable for admin useres

if not admin will sent 403

- /auth/admin/update_role
    - changes a useres role, this will also log out the user from all accounts.
    - method: post
    - body: json
    - body format:
        user_id:String
        new_role: String
