/**
 * Summary:playback DRM service
 * Description: This playback DRM service uses Playready DRM
 * @author Akash Sharma
 * @date  04.08.2018
 */

const playbackDrmService = {
    loadDrmClient,
    sendRightInformation,
    subscribeLicensingError,
    isOKtoPlay,
    getDrmClient,
    getDrmType,
    setMediaSource,
    unloadDrmClient
};
var appId = "com.zenith.app.playreadytest";
var drmType = "playready";
var clientId;
var isDrmClientLoaded;
var OKTOPLAY = true;
var msgId;
var subscriptionHandler;
// Message type for PlayReady
var msgType = "application/vnd.ms-playready.initiator+xml";

// Unique ID of DRM system
var drmSystemId = "urn:dvb:casystemid:19219";

// Message  for playready
var msg = "<?xml version='1.0' encoding='utf-8'?>" +
    "<PlayReadyInitiator xmlns= 'http://schemas.microsoft.com/DRM/2007/03/protocols/'>" +
    "<LicenseAcquisition>" +
    "<Header>" +
    "<WRMHEADER xmlns= 'http://schemas.microsoft.com/DRM/2007/03/PlayReadyHeader' version='4.0.0.0'>" +
    "<DATA>" +
    "<PROTECTINFO>" +
    "<KEYLEN>16</KEYLEN>" +
    "<ALGID>AESCTR</ALGID>" +
    "</PROTECTINFO>" +
    "<LA_URL>http://playready.directtaps.net/pr/svc/rightsmanager.asmx</LA_URL>" +
    "<KID>lFmb2gxg0Cr5bfEnJXgJeA==</KID>" +
    "<CHECKSUM>P7ORpD2IpA==</CHECKSUM>" +
    "</DATA>" +
    "</WRMHEADER>" +
    "</Header>" +
    "<CustomData>AuthZToken XYZ</CustomData>" +
    "</LicenseAcquisition>" +
    "</PlayReadyInitiator>"

/**
 *  Load the DRM client and get Client ID 
 */
function loadDrmClient() {
    var that = this;
    try {
        //function loadDrmClient() {
         window.webOS.service.request("luna://com.webos.service.drm", {
            method: "load",
            parameters: {
                "drmType": drmType,
                "appId": appId
            },
            onSuccess: function (result) {
                clientId = result.clientId;
                isDrmClientLoaded = true;
                console.log("DRM Client is loaded successfully. clientId = " + clientId);
                that.sendRightInformation();
            },
            onFailure: function (result) {
                console.log("[" + result.errorCode + "] " + result.errorText);
                OKTOPLAY = false;
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

/**
 * Get the right information from box and verify to the DRM
 */
function sendRightInformation() {
     window.webOS.service.request("luna://com.webos.service.drm", {
        method: "sendDrmMessage",
        parameters: {
            "clientId": clientId,
            "msgType": msgType,
            "msg": msg,
            "drmSystemId": drmSystemId
        },
        onSuccess: function (result) {
            msgId = result.msgId;
            subscribeLicensingError();
         },
        onFailure: function (result) {
            console.log("[" + result.errorCode + "] " + result.errorText);
            OKTOPLAY = false;
        }
    });
}

/**
 *  Call back when Media content decryption error
 */
function subscribeLicensingError() {

    var request = window.webOS.service.request("luna://com.webos.service.drm", {
        method: "getRightsError",
        parameters: {
            "clientId": clientId,
            "subscribe": true
        },
        onSuccess: function (result) { // Subscription Callback
            const contentId = result.contentId;
            if (contentId === msgId) {
                if (0 === result.errorState) {
                    OKTOPLAY = false;
                }
                else if (1 === result.errorState) {
                    OKTOPLAY = false;
                }
            }
        },
        onFailure: function (result) {
            OKTOPLAY = false;
        }
    });
    //Register subscription handler
    subscriptionHandler = request;
}

/**
 * return is playback is ready for play
 */
function isOKtoPlay() {
    return OKTOPLAY;
}

function getDrmClient() {
    return clientId;
}

function getDrmType() {
    return drmType;
}

/**
 *  Description: Unload the DRM Client
 */
function unloadDrmClient() {
    if (isDrmClientLoaded) {
         window.webOS.service.request("luna://com.webos.service.drm", {
            method: "unload",
            parameters: { "clientId": clientId },
            onSuccess: function (result) {
                isDrmClientLoaded = false;
                console.log("DRM Client is unloaded successfully.")
            },
            onFailure: function (result) {
                console.log("unloadDrmClient Failure [" + result.errorCode + "] " + result.errorText);
            }
        });
        subscriptionHandler.cancel();
    }
}

/**
 * Description : DRM client gets a license key from License Server and playback options to Media Pipeline with video element 
 * @return {null}
 */
function setMediaSource() {
    if (OKTOPLAY) {
        var options = {};
        options.mediaTransportType = "MSIIS";
        options.option = {};
        options.option.drm = {};
        options.option.drm.type = drmType;
        options.option.drm.clientId = clientId;
        var mediaOption = escape(JSON.stringify(options));
        var source = document.getElementById("soruceId");
        source.setAttribute('type', 'video/mp4;mediaOption=' + mediaOption);
    } else {
        console.log("Unable to play, there was an DRM error check log for more info.");
    }
}
export default playbackDrmService;