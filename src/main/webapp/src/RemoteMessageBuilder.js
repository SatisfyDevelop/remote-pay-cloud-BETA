/**
 * Builds messages to pass to the clover device.
 *
 *
 * @see vcom.clover.remote.protocol.RemoteMessage
 * @param {string} packagename -the packagename used in constructing the messages
 * @constructor
 */
function RemoteMessageBuilder(defaultPackageName, remoteSourceSDK, remoteApplicationID) {

    this.defaultPackageName = defaultPackageName;
    this.remoteSourceSDK = remoteSourceSDK;
    this.remoteApplicationID = remoteApplicationID;

    // generate a single uuid prefix for use with this builder instance.
    this.ackUuidPrefix = CloverID.guid();
    this.ackIdCounter = 0;

    /**
     * Build a message given the inputs
     *
     * @param {string} method - One of the LanMethod constants
     * @param {string} type - one of the RemoteMessageBuilder constants
     * @param {json} payload - the json object payload (not a string)
     * @param {string} packageName - an override of the package name (optional)
     * @returns {json} the constructed message - a json object
     */
    this.buildRemoteMessage = function (method, type, payload, packageName) {
        var lanMessage = {};
        // Note, this may be overwritten later...
        lanMessage.id = this.generateNextAckId();

        if (method) lanMessage.method = method;
        lanMessage.packageName = this.defaultPackageName; //"com.clover.remote.protocol.websocket";
        if (packageName)lanMessage.packageName = packageName;
        // This is how they are doing the payload...
        if (!payload)payload = {"method": method};
        lanMessage.payload = JSON.stringify(payload);
        lanMessage.type = RemoteMessageBuilder.COMMAND;

        lanMessage.remoteSourceSDK = this.remoteSourceSDK;
        lanMessage.remoteApplicationID = this.remoteApplicationID;

        if (type)lanMessage.type = type;
        // There is an 'id' in the java instance, but I do not see it being used right now.
        return lanMessage;
    };

    this.generateNextAckId = function() {
      return this.ackUuidPrefix + "_" + (++this.ackIdCounter);
    };

    /**
     * Builds a transaction start message
     *
     * @param {json} payload - an order object
     * @returns {json} the constructed message
     */
    this.buildTxStart = function (payload) {
        payload.method = LanMethod.TX_START;
        return this.buildRemoteMessage(LanMethod.TX_START, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a discovery request message
     *
     * @returns {json} the constructed message
     */
    this.buildDiscoveryRequest = function () {
        return this.buildRemoteMessage(LanMethod.DISCOVERY_REQUEST);
    }

    /**
     * Builds a signature verified message
     *
     * @param {json} payload - the signature verified object
     * @returns {json} the constructed message
     */
    this.buildSignatureVerified = function (payload) {
        payload.method = LanMethod.SIGNATURE_VERIFIED;
        return this.buildRemoteMessage(LanMethod.SIGNATURE_VERIFIED, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a payment confirmed message
     *
     * @param {json} payload - the payment confirmation object
     * @returns {json} the constructed message
     */
    this.buildConfirmPayment = function (payload) {
        payload.method = LanMethod.PAYMENT_CONFIRMED;
        return this.buildRemoteMessage(LanMethod.PAYMENT_CONFIRMED, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a payment rejected message
     *
     * @param {json} payload - the payment rejection object
     * @returns {json} the constructed message
     */
    this.buildRejectPayment = function (payload) {
        payload.method = LanMethod.PAYMENT_REJECTED;
        return this.buildRemoteMessage(LanMethod.PAYMENT_REJECTED, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a signature verified message
     *
     * @param {json} payload - the signature verified object
     * @returns {json} the constructed message
     */
    this.buildPaymentVoid = function (payload) {
        payload.method = LanMethod.PAYMENT_VOIDED;
        return this.buildRemoteMessage(LanMethod.PAYMENT_VOIDED, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a void payment message
     *
     * @param {json} payload - the signature verified object
     * @returns {json} the constructed message
     */
    this.buildVoidPayment = function (payload) {
        payload.method = LanMethod.VOID_PAYMENT;
        return this.buildRemoteMessage(LanMethod.VOID_PAYMENT, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a vault card message
     *
     * @param {json} payload - card entry types allowed
     * @returns {json} the constructed message
     */
    this.buildVaultCard = function (payload) {
        payload.method = LanMethod.VAULT_CARD;
        return this.buildRemoteMessage(LanMethod.VAULT_CARD, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a refund payment message
     *
     * @param {json} payload - the orderid and paymentid with optional amount
     * @returns {json} the constructed message
     */
    this.buildRefund = function (payload) {
        payload.method = LanMethod.REFUND_REQUEST;
        return this.buildRemoteMessage(LanMethod.REFUND_REQUEST, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a capture preauth message
     *
     * @param {json} payload - the orderid, paymentid, amount, with optional tipAmount
     * @returns {json} the constructed message
     */
    this.buildCapturePreAuth = function (payload) {
        payload.method = LanMethod.CAPTURE_PREAUTH;
        return this.buildRemoteMessage(LanMethod.CAPTURE_PREAUTH, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a closeout message
     *
     * @param {json} payload - optional allowOpenTabs and batchid
     * @returns {json} the constructed message
     */
    this.buildCloseout = function (payload) {
        payload.method = LanMethod.CLOSEOUT_REQUEST;
        return this.buildRemoteMessage(LanMethod.CLOSEOUT_REQUEST, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a tip adjust payment message
     *
     * @param {json} payload - the orderid and paymentid with amount
     * @returns {json} the constructed message
     */
    this.buildTipAdjust = function (payload) {
        payload.method = LanMethod.TIP_ADJUST;
        return this.buildRemoteMessage(LanMethod.TIP_ADJUST, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to show the receipt options screen for a payment
     *
     * @param {json} payload - the orderid and paymentid
     * @returns {json} the constructed message
     */
    this.buildShowPaymentReceiptOptions = function (payload) {
        payload.method = LanMethod.SHOW_PAYMENT_RECEIPT_OPTIONS;
        return this.buildRemoteMessage(LanMethod.SHOW_PAYMENT_RECEIPT_OPTIONS, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to open the cash drawer
     *
     * @param {json} payload - an empty map/object
     * @returns {json} the constructed message
     */
    this.buildOpenCashDrawer = function (payload) {
        payload.method = LanMethod.OPEN_CASH_DRAWER;
        return this.buildRemoteMessage(LanMethod.OPEN_CASH_DRAWER, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to get the last 'transactional' message from the device.
     *
     * @param {json} payload - an empty map/object
     * @returns {json} the constructed message
     */
    this.buildLastMessageRequest = function (payload) {
        payload.method = LanMethod.LAST_MSG_REQUEST;
        return this.buildRemoteMessage(LanMethod.LAST_MSG_REQUEST, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a terminal message (display message for device)
     *
     * @param {json} payload - the message
     * @returns {json} the constructed message
     */
    this.buildTerminalMessage = function (payload) {
        payload.method = LanMethod.TERMINAL_MESSAGE;
        return this.buildRemoteMessage(LanMethod.TERMINAL_MESSAGE, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to print passed text
     *
     * @param {json} payload - an object of the form {"textLines" : textLines}
     * @returns {json} the constructed message
     */
    this.buildPrintText = function (payload) {
        payload.method = LanMethod.PRINT_TEXT;
        return this.buildRemoteMessage(LanMethod.PRINT_TEXT, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to print the (small) passed image
     *
     * @param {json} payload - an object that has a single attribute;
     *  "png" : Base64 data.
     * @returns {json} the constructed message
     */
    this.buildPrintImage = function (payload) {
        payload.method = LanMethod.PRINT_IMAGE;
        return this.buildRemoteMessage(LanMethod.PRINT_IMAGE, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * Builds a message to send to the device to make it show the welcome screen
     *
     * @returns {json} the constructed message
     */
    this.buildShowWelcomeScreen = function () {
        return this.buildRemoteMessage(LanMethod.SHOW_WELCOME_SCREEN, RemoteMessageBuilder.COMMAND);
    }

    /**
     * Builds a message to indicate a cancel
     *
     * @returns {json} the constructed message
     */
    this.buildFinishCancel = function () {
        return this.buildRemoteMessage(LanMethod.FINISH_CANCEL, RemoteMessageBuilder.COMMAND);
    }

    /**
     * Builds a message to send to the device to make it show the 'Thank You' screen
     *
     * @returns {json} the constructed message
     */
    this.buildShowThankYouScreen = function () {
        return this.buildRemoteMessage(LanMethod.SHOW_THANK_YOU_SCREEN, RemoteMessageBuilder.COMMAND);
    }

    /**
     * Builds a message to drive the device to show an order on the screen
     *
     * @param {json} payload - an order object
     * @returns {json} the constructed message
     */
    this.buildShowOrderScreen = function (payload) {
        payload.method = LanMethod.SHOW_ORDER_SCREEN;
        return this.buildRemoteMessage(LanMethod.SHOW_ORDER_SCREEN, RemoteMessageBuilder.COMMAND, payload);
    }

    /**
     * @private
     * @returns {json} the ping message
     */
    this.buildPing = function () {
        return this.buildRemoteMessage(null, RemoteMessageBuilder.PING);
    }

    /**
     * @private
     * @returns {json} a keypress message
     */
    this.buildKeyPress = function (payload) {
        payload.method = LanMethod.KEY_PRESS;
        return this.buildRemoteMessage(LanMethod.KEY_PRESS, RemoteMessageBuilder.COMMAND, payload);
    }


    /**
     * @private
     * @returns {json} a break message
     */
     this.buildBreak = function (payload) {
         payload.method = LanMethod.BREAK;
         return this.buildRemoteMessage(LanMethod.BREAK, RemoteMessageBuilder.COMMAND, payload);
     }

    /**
     * @private
     * @returns {json} the pong message
     */
    this.buildPong = function () {
        return this.buildRemoteMessage(null, RemoteMessageBuilder.PONG);
    }

    /**
     * Builds a message to ask the device to shutdown
     *
     * @param {json} payload - the message
     * @returns {json} the constructed message
     */
    this.buildShutdown = function () {
        return this.buildRemoteMessage(LanMethod.SHUTDOWN, RemoteMessageBuilder.COMMAND);
    }
}
RemoteMessageBuilder.COMMAND = "COMMAND";
RemoteMessageBuilder.QUERY = "QUERY";
RemoteMessageBuilder.EVENT = "EVENT";
RemoteMessageBuilder.PING = "PING";
RemoteMessageBuilder.PONG = "PONG";
RemoteMessageBuilder.FORCE = "forceConnect";


/**
 * The set of messages understood by the clover device
 *
 * @see com.clover.remote.protocol.LanMethod (java API)
 * @constructor
 */
function LanMethod() {
};
/** The transaction start method type */
LanMethod.TX_START = "TX_START";
/** The response to the tX_START */
LanMethod.TX_START_RESPONSE = "TX_START_RESPONSE";
/** The key pressed method type */
LanMethod.KEY_PRESS = "KEY_PRESS";
/** The user interface state change method type */
LanMethod.UI_STATE = "UI_STATE";
/** The transaction state change method type */
LanMethod.TX_STATE = "TX_STATE";
/** The finish ok method type */
LanMethod.FINISH_OK = "FINISH_OK";
/** The finish cancel method type */
LanMethod.FINISH_CANCEL = "FINISH_CANCEL";
/** The discovery request method type */
LanMethod.DISCOVERY_REQUEST = "DISCOVERY_REQUEST";
/** The discovery response method type */
LanMethod.DISCOVERY_RESPONSE = "DISCOVERY_RESPONSE";
/** The tip added method type */
LanMethod.TIP_ADDED = "TIP_ADDED";
/** The verify signature request method type */
LanMethod.VERIFY_SIGNATURE = "VERIFY_SIGNATURE";
/** The signature verification result method type */
LanMethod.SIGNATURE_VERIFIED = "SIGNATURE_VERIFIED";
/** The payment voided method type */
LanMethod.PAYMENT_VOIDED = "PAYMENT_VOIDED";
/** The print payment request method type */
LanMethod.PRINT_PAYMENT = "PRINT_PAYMENT";
/** The print merchant payment copy method type */
LanMethod.PRINT_PAYMENT_MERCHANT_COPY = "PRINT_PAYMENT_MERCHANT_COPY";
/** The print credit method type */
LanMethod.PRINT_CREDIT = "PRINT_CREDIT";
/** The print payment declined method type */
LanMethod.PRINT_PAYMENT_DECLINE = "PRINT_PAYMENT_DECLINE";
/** The print credit declined method type */
LanMethod.PRINT_CREDIT_DECLINE = "PRINT_CREDIT_DECLINE";
/** The print text method type */
LanMethod.PRINT_TEXT = "PRINT_TEXT";
/** The print image method type */
LanMethod.PRINT_IMAGE = "PRINT_IMAGE";
/** The terminal message method type */
LanMethod.TERMINAL_MESSAGE = "TERMINAL_MESSAGE";
/** The show welcome screen method type */
LanMethod.SHOW_WELCOME_SCREEN = "SHOW_WELCOME_SCREEN";
/** The show thank you screen method type */
LanMethod.SHOW_THANK_YOU_SCREEN = "SHOW_THANK_YOU_SCREEN";
/** The show order screen method type */
LanMethod.SHOW_ORDER_SCREEN = "SHOW_ORDER_SCREEN";
/** The break method type */
LanMethod.BREAK = "BREAK";
/** The void payment method type */
LanMethod.VOID_PAYMENT = "VOID_PAYMENT";
/** The refund request method type */
LanMethod.REFUND_REQUEST = "REFUND_REQUEST";
/** The refund response method type */
LanMethod.REFUND_RESPONSE = "REFUND_RESPONSE";
/** THE OPTIONTYPE TO SHOW THE PAYMENT RECEIPT SCREEN */
LanMethod.SHOW_PAYMENT_RECEIPT_OPTIONS = "SHOW_PAYMENT_RECEIPT_OPTIONS";
/** The type to open the cash drawer */
LanMethod.OPEN_CASH_DRAWER = "OPEN_CASH_DRAWER";
/** The tip adjust request method type */
LanMethod.TIP_ADJUST = "TIP_ADJUST";
/** The tip adjust request method type */
LanMethod.TIP_ADJUST_RESPONSE = "TIP_ADJUST_RESPONSE";
/** The message type for a refund print message */
LanMethod.REFUND_PRINT_PAYMENT = "REFUND_PRINT_PAYMENT";
/** Message returned when request for last message is sent */
LanMethod.LAST_MSG_RESPONSE = "LAST_MSG_RESPONSE";
/** Message type to get the last message sent/received to/from the device */
LanMethod.LAST_MSG_REQUEST = "LAST_MSG_REQUEST";
/** Message type to capture a pre auth payment */
LanMethod.CAPTURE_PREAUTH = "CAPTURE_PREAUTH";
/** Message type returned to capture a pre auth payment */
LanMethod.CAPTURE_PREAUTH_RESPONSE = "CAPTURE_PREAUTH_RESPONSE";
/** Message type to Request to capture card info */
LanMethod.VAULT_CARD = "VAULT_CARD";
/** Message type to respond to capture card info request */
LanMethod.VAULT_CARD_RESPONSE = "VAULT_CARD_RESPONSE";
/** Message type to request closeout*/
LanMethod.CLOSEOUT_REQUEST = "CLOSEOUT_REQUEST"
/** Message type to respond to closeout request */
LanMethod.CLOSEOUT_RESPONSE = "CLOSEOUT_RESPONSE";
/** Message returned when a payment is challenged.  Requires user confirmation */
LanMethod.CONFIRM_PAYMENT_MESSAGE = "CONFIRM_PAYMENT_MESSAGE";
/** Message sent when a challenged payment is confirmed */
LanMethod.PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED";
/** Message sent when a challenged payment is confirmed */
LanMethod.PAYMENT_REJECTED = "PAYMENT_REJECTED";

/**
 * The shutdown method type
 * This is a special type only present in the cloud adaptor.
 */
LanMethod.SHUTDOWN = "SHUTDOWN";

/**
 * The acknowledgement method type
 * This is a special type only present in the cloud adaptor.
 */
LanMethod.ACK = "ACK";

/**
 * The acknowledgement method type
 * This is a special type only present in the cloud adaptor.
 */
LanMethod.ERROR = "ERROR";


/**
 * Enumeration of void reason codes
 *
 * @readonly
 * @enum {string}
 */
var VoidReason = {
    USER_CANCEL: "USER_CANCEL",
    TRANSPORT_ERROR: "TRANSPORT_ERROR",
    REJECT_SIGNATURE: "REJECT_SIGNATURE",
    REJECT_PARTIAL_AUTH: "REJECT_PARTIAL_AUTH",
    NOT_APPROVED: "NOT_APPROVED",
    FAILED: "FAILED",
    AUTH_CLOSED_NEW_CARD: "AUTH_CLOSED_NEW_CARD",
    REJECT_DUPLICATE: "REJECT_DUPLICATE"
};

// com.clover.remote.terminal.KeyPress
/**
 * Enumeration of key press codes
 *
 * @readonly
 * @enum {string}
 */
var KeyPress = {
    NONE: "NONE",
    ENTER: "ENTER",
    ESC: "ESC",
    BACKSPACE: "BACKSPACE",
    TAB: "TAB",
    STAR: "STAR",

    BUTTON_1: "BUTTON_1",
    BUTTON_2: "BUTTON_2",
    BUTTON_3: "BUTTON_3",
    BUTTON_4: "BUTTON_4",
    BUTTON_5: "BUTTON_5",
    BUTTON_6: "BUTTON_6",

    DIGIT_1: "DIGIT_1",
    DIGIT_2: "DIGIT_2",
    DIGIT_3: "DIGIT_3",
    DIGIT_4: "DIGIT_4",
    DIGIT_5: "DIGIT_5",
    DIGIT_6: "DIGIT_6",
    DIGIT_7: "DIGIT_7",
    DIGIT_8: "DIGIT_8",
    DIGIT_9: "DIGIT_9",
    DIGIT_0: "DIGIT_0"
}
