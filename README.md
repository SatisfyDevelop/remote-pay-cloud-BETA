Clover Cloud Web Socket Connection Web Application
====================================================
The purpose of this repository is to illustrate the communication of your web application to [Clover Mini](https://www.clover.com/pos-hardware/mini) to allow a merchant's customers to make payments: credit, debit, EMV contact and contactless (including Apple Pay), EBT, and more. This serves as a starting point for the JS SDK protocol integration library. Learn more about Clover integrations at [clover.com/integrations](https://www.clover.com/integrations).

This produces a runnable jar that will serve a web application. There are several prerequisites that must be set up for this to work:
- The web application is served by Jetty, so you need a JDK installed.
- The web application uses JavaScript WebSocket objects, so the browser you use must support WebSockets. See [WebSocket Browser Support](http://caniuse.com/#feat=websockets).

## Create a Clover Application

1.  [Create a Clover developer account](https://docs.clover.com/build/#first-create-your-developer-account) if you do not already have one.
7.  After claiming your account, [create a web app](https://docs.clover.com/build/web-apps/#step-1-create-your-clover-web-app) on your developer dashboard. Make sure to expand the "Web App" 'App Type' section and enter the Site URL and [CORS domain](https://docs.clover.com/build/web-apps/cors/) of your app.
    
## Configure the Example Application    
    
1.  On the "Your Apps" page, find and copy the "App ID".  
2.  In the [src/CloverOAuth.js](src/main/webapp/src/CloverOAuth.js) file, replace the value of `config.clientId` with the value of your App ID.
2.  In the [src/CloverOAuth.js](src/main/webapp/src/CloverOAuth.js) file, ensure the value of `config.domain` is set to the URL of the Clover server.
       
       
Make sure the Cloud Pay Display app is installed for your merchant on your Clover device.
    
## Build and run the Example Application
    
You must have maven and a JDK installed.

Build the app:
```
mvn package
```
Run the app inside a jetty container:
```
java -jar target/dependency/jetty-runner.jar target/*.war
```
