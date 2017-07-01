var inputs = $(".textbox > input");
inputs.each(function (index, elem) {
    elem = $(elem);
    if (elem.val().length > 0)
        elem.addClass("hastext");
});
inputs.change(function () {
    const me = $(this);
    if (me.val().length > 0)
        me.addClass("hastext");
    else
        me.removeClass("hastext");
});

var port = browser.runtime.connect({name:"popup-eng"});
port.postMessage({action: "register"});
port.onMessage.addListener(function(msg) {

    if(msg.action == "passwords") {
        setPasswords(msg.data);
    }
    if (msg.action == "reset") {

        const tableBody = $("#tbodyPasswords");
        const loginPage = $("#login-page");
        const passPage = $("#password-page");

        passPage.fadeOut(300);
        tableBody.html("");
        setTimeout(function () {
            loginPage.fadeIn(300);
        }, 300);
    }
});

$("#page_login_form_login").submit(function (event) {

    event.preventDefault();

    port.postMessage({action: "login", data: $("#page_login_form_login").serialize()});

});
function insertPassword(id) {

    port.postMessage({action: "insert", id: id})
}
function setPasswords(data) {

    const tableBody = $("#tbodyPasswords");
    const loginPage = $("#login-page");
    const passPage = $("#password-page");

    data.forEach(function (value) {
        const button = "<button class='btn btn-success' id='pass-" + value.password_id + "'>Insert</button>";
        var add = "<tr>";
        add += field(value.username);
        add += field(value.description);
        add += field(value.date_added_readable);
        add += field(button);
        add += "</tr>";

        tableBody.append(add);

        $("#pass-" + value.password_id).click(function () {
            insertPassword(value.password_id);
        });
    });
    loginPage.fadeOut(300);
    setTimeout(function () {
        passPage.fadeIn(300);
    }, 300);

}
function field(value) {
    return "<td>" + value + "</td>";
}