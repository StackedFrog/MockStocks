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


# Stocks Api
Api to get general information about stocks.

- /stock
    - endpoint to get basic data about a stock symbol
    - method: get
    - Query parameter: symbol:String
    - returns: Json object which includes symbol:String, date:String, close:Number, open:Number, high:Number, low:Number, volume:Number

- /stocks
    - endpoint to get basic data about serveral stocks at the same time 
    - method: get
    - Query parameter: symbol:String (e.g. "AAPL,TSLA,MSFT")
    - returns: Json object which includes Array of the Json object from /stocks

- /range
    - endpoint to get stock data over a certain amount of time
    - method: get
    - Query parameters: symbol:String, range:String (e.g. "6mo"), interval:String (e.g. "15m")
    - returns: Json object which includes symbol:String, range:String, quotes:Array of Quotes (object of the /stock endpoint)
    
- /history
    - endpoint to get data about a stock in a specific time span
    - method: get
    - Query parameters: symbol:String, start:String (in RFC3339 format), end:String (in RFC3339 format)
    - returns: Json object which includes symbol:String, start:String (RFC3339 format), end:String (RFC3339 format), quotes:Array of Quotes (object of the /stock endpoint)

- /ticker
    - endpoint to get stocks that match the symbol string 
    - method: get
    - Query parameters: symbol:String
    - returns: Json object of an Array which has following structure: symbol:String, name:String, exchange:String 
