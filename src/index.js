var loggedIn = false;
var accessToken = "";
var passwords = [];
var contentConnector = null;
var popupConnector = null;

browser.runtime.onConnect.addListener(function (port) {

    const name = port.name;

    if (name == "content-eng") registerContentListener(port);
    if (name == "popup-eng") registerPopUpListener(port);


});

function login(data) {

    $.ajax({
        method: 'POST',
        url: 'https://dev.liz3.net/passy-api/index.php',
        data: data,
        success: function (response) {
            console.log(response);
            if (response.success) {
                accessToken = response.token[0];
                fetchPasswords(function (response) {
                    if (response.success) {
                        passwords = response.data;
                        loggedIn = true;
                        popupConnector.postMessage({action: "passwords", data: response.data})

                    }
                });

                const checker = setInterval(function () {

                    $.ajax({
                        method: 'POST',
                        url: 'https://dev.liz3.net/passy-api/index.php',
                        data: "a=" + encodeURIComponent("status") + "&" +
                        encodeURIComponent("access_token") + "=" +
                        encodeURIComponent(accessToken),
                        success: function (response) {

                            if (response.data.logged_in == false) {
                                clearInterval(checker);
                                loggedIn = false;
                                accessToken = "";
                                if(popupConnector != null) popupConnector.postMessage({action: "reset"});
                            }
                        },
                        error: function (response) {


                        }
                    })
                }, 2000)
            }
        },
        error: function (response) {

        }
    })
}
function registerPopUpListener(port) {

    port.onMessage.addListener(function (m) {
        if (m.action == "login") {
            login(m.data);
        }
        if(m.action == "register") {
            if(loggedIn) {
                popupConnector.postMessage({action: "passwords", data: passwords})
            } else {
                console.log("Not logged on");
            }
        }
        if (m.action == "insert") {
            fetchPassword(m.id, function (response) {
                if(response.success) {
                    contentConnector.postMessage({action: "insert", password: response.data.password})
                }
            });
        }
    });

    popupConnector = port;
}

function registerContentListener(port) {

    port.onMessage.addListener(function (m) {

    });


    contentConnector = port;
}
function fetchPassword(id, callback) {

    $.ajax({
        method: 'POST',
        url: 'https://dev.liz3.net/passy-api/index.php',
        data: "a=" + encodeURIComponent("password/query") + "&" +
        encodeURIComponent("access_token") + "=" +
        encodeURIComponent(accessToken) + "&id=" + encodeURIComponent(id),
        success: function (response) {
            callback(response);
        },
        error: function (response) {
            callback(response);

        }
    })
}
function fetchPasswords(callback) {

    $.ajax({
        method: 'POST',
        url: 'https://dev.liz3.net/passy-api/index.php',
        data: "a=" + encodeURIComponent("password/queryAll") + "&" +
        encodeURIComponent("access_token") + "=" +
        encodeURIComponent(accessToken),
        success: function (response) {
            callback(response);
        },
        error: function (response) {
            callback(response);

        }
    })

}