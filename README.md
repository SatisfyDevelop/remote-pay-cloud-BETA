# ** Final Version of BETA. **

## Version 1.0.0 of the Clover SDK for Javascript Integration which replaces this is a library only, unlike the BETA version which has been the repository for the library, as well as the examples of usage.  It introduces a more standard versioning, as well as usage of more standard javascript constructs, structure and directives.  It also introduces hosting on NPM of the library.
---

Clover Cloud Web Socket Connection Web Application
====================================================
The purpose of this repository is to illustrate the communication of your web application to [Clover Mini](https://www.clover.com/pos-hardware/mini) to allow a merchant's customers to make payments: credit, debit, EMV contact and contactless (including Apple Pay), EBT, and more. This serves as a starting point for the JS SDK protocol integration library. Learn more about Clover integrations at [clover.com/integrations](https://www.clover.com/integrations).

This produces a runnable jar that will serve a web application. There are several prerequisites that must be set up for this to work:
- The web application is served by Jetty, so you need a JDK installed.
- The web application uses JavaScript WebSocket objects, so the browser you use must support WebSockets. See [WebSocket Browser Support](http://caniuse.com/#feat=websockets).
- To complete a transaction end-to-end, we recommend getting a [Clover Mini Dev Kit](http://cloverdevkit.com/collections/devkits/products/clover-mini-dev-kit).

## Create a Clover Application

1.  [Create a Clover developer account](https://docs.clover.com/build/#first-create-your-developer-account) if you do not already have one.
7.  After claiming your account, [create a web app](https://docs.clover.com/build/web-apps/#step-1-create-your-clover-web-app) on your developer dashboard. Make sure to expand the "Web App" 'App Type' section and enter the Site URL and [CORS domain](https://docs.clover.com/build/web-apps/cors/) of your app.

### Webhook Example (optional)
If you want to use the embedded webhook example, you will need to run the example on a public facing web server.  You 
will need to run the example before you can perform the verification of the webhook. The default address of the webhook
in the example is ```http://<yourserver>/webhook```.  The default server used in the webhook example is
`https://apidev1.dev.clover.com`.  These values can be changed by modifying the `web.xml` file.  

There are two servlets that are used to demonstrate the webhook functionality.  The webhook servlet echoes the 
information sent to the hook.  It reads merchant authentication tokens from a file on the server running this example.
The second servlet will write merchant authentication tokens to the file.  There is a button on the min Cloud example 
that will allow you to send the current merchant authentication token to be written.

View our [Webhooks Developer Docs](https://docs.clover.com/build/web-apps/webhooks/) for details on how to configure and use webhooks.
    
## Configure the Example Application    
    
Make sure the Cloud Pay Display app is installed for your merchant on your Clover device.
For the main "Cloud Example", you will need the "App ID".  On the "Your Apps" page, find and copy the "App ID".

The "Simple" examples require information that can be obtained by running the "Cloud Example".             
    
## Build and run the Example Application
    
You must have maven and a JDK installed.

Build, package and run the app inside a jetty container:
```
mvn jetty:run
```

You will need to configure your browser to accept the included self signed certificate in order to test using the SSL 
url (https://localhost:8443).

_*Note*_:  (Optional) To regenerate the certificate to use a server name other than 'localhost', a command similar to
the following can be used:
```
keytool -genkey -alias jetty7 -keyalg RSA -keystore src/test/resources/jetty.keystore -storepass password -keypass password -dname "CN=localhost"
```
__*Note*__: The ports can be changed in the maven build file (pom.xml), or can be specified on the command line, for example:
```
sudo mvn -Djetty.port=80 -Dhttps.port=443 clean package jetty:run
```
however the `mvn` commands require root (`sudo`) permissions on *nix* based environments if either of the ports are less than 1024.

## Make a Transaction

###High Level API
This example refers to the source files in the [webapp directory](https://github.com/clover/remote-pay-cloud/blob/master/src/main/webapp).

To make a payment using the High Level Cloud API
####Create the Clover object.
```
var clover = new Clover(configuration);
```

There are several ways the Clover object can be configured. See the [Clover](https://rawgit.com/clover/remote-pay-cloud/master/src/main/webapp/docs/Clover.html)
documentation for details on the [CloverConfig](https://rawgit.com/clover/remote-pay-cloud/master/src/main/webapp/docs/global.html#CloverConfig)
object and how to set up your connection.

Examples of creating the Clover object:

1. With a clientID, domain, merchantId, deviceSerialId
```
{
  "clientId" : "3BZPZ6A6FQ8ZM",
  "domain" : "https://sandboxdev.dev.clover.com/",
  "merchantId" : "VKYQ0RVGMYHRR",
  "deviceSerialId" : "C021UQ52340078"
}
```
1. With a oauthToken, domain, merchantId, deviceSerialId
```
{
  "oauthToken" : "6e6313e8-ff33-8662-7ff2-3a6690e0ff14",
  "domain" : "https://sandboxdev.dev.clover.com/",
  "merchantId" : "VKYQ0RVGMYHRR",
  "deviceSerialId" : "C021UQ52340078"
}
```
1. Relying on a saved configuration in a cookie

####Define how your program will use the Clover object
#####In this example, this function will be passed when we start communicating with the device.  If there is an error when communication is initiated, this function will get the error as a parameter.
```
function makeASale(error) {
  if(error) console.log(error)
  else clover.sale({"amount" : 12345, "tipAmount" : 123 }, mySaleResult);
}
```

#####Here we define the error-first callback that we pass in to the Clover.sale function above.  If an error occurs, it will be the first parameter.
```
function mySaleResult(error, saleResult) {
  // do something with the result
}
```

####Start communicating with the device and tell the device to call your program when it is ready
```
clover.initDeviceConnection(makeASale);
```
####Disclaimer
This is a beta release and will not be supported long term. There may be a few incompatible changes in the general release, which is coming soon. 

View our [documentation](https://rawgit.com/clover/remote-pay-cloud/master/src/main/webapp/docs/index.html) to see the 
details of the JS SDK protocol for showing order details, starting a transaction, and getting a payment response back 
from the Clover device.
