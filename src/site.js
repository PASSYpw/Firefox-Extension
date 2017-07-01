/**
 * Created by liz3 on 26.06.17.
 */
var activeField = null;
var port = browser.runtime.connect({name:"content-eng"});
port.onMessage.addListener(function(msg) {

    if (msg.action == "insert") {
        const password = msg.password;
        activeField.val(password);
    }
});

document.addEventListener("focus", function (event) {
    var elem = $(event.target);
    if (elem.is("input") || elem.is("textarea"))
        activeField = elem;
}, true);