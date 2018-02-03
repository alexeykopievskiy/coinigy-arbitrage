"use strict";

var _keys = require("./config/keys");

var socketCluster = require('socketcluster-client');

var options = require("./config/options");

console.log(options, _keys.api_credentials);

// Establish connection to websocket server
var SCsocket = socketCluster.connect(options);

// Once connected, authenticate with credentials
SCsocket.on('connect', function (status) {

    SCsocket.emit("auth", _keys.api_credentials, function (err, token) {

        if (!err && token) {
            // Successful authentication, so let's try and subscribe to a few channels!
            // Channel format is as follows:
            // TYPE-EXCHANGECODE--BASECURRENCY--QUOTECURRENCY
            // NOTE: Use "WSTRADE" type for Bittrex only. e.g. "WSTRADE-BTRX--NEO--BTC"
            // All other exchanges use "TRADE" e.g. "TRADE-BITF--ETH--USD"


            // Subscribe to Bittrex Ethereum/Bitcoin market's live websocket trade feed
            var scChannel = SCsocket.subscribe("ORDER-BTRX--ETH--BTC");

            scChannel.watch(function (data) {
                console.log(data, 'data');
                // log output as new messages stream in
                console.log(data.time_local + " " + data.price + " " + data.quantity + " " + data.type);
            });

            // Optional: Get a list of all Bittrex (BTRX) channels.
            // SCsocket.emit("channels", "BTRX", function (err, data) {
            //     if (!err) {
            //         console.log(data);
            //     } else {
            //         console.log(err)
            //     }   
            // });

        } else {

            console.log(err);
        }
    });
});

// Catch and log any error messages
SCsocket.on('error', function (status) {
    console.log(status);
});