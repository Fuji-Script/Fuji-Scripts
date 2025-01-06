//@ author Leo728
//@ version 1.0
//@ description A script that bypass chat filters.
var module = rise.registerModule("ChatBypass", "Gives you the right to say n1g/e® in hypixel. Freedom of Speech!!!!!! America!!!!")

script.handle("onUnload", function () {
    module.unregister()
})

function toShitChar(message) {
    var field1 = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    var field2 = "ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍ０１２３４５６７８９"
    var result = ""

    for (var i = 0; i < message.length; i++) {
        var char = message.charAt(i)
        var index = field1.indexOf(char)
        if (index !== -1) {
            result += field2.charAt(index)
        } else {
            result += char
        }
    }

    return result
}


module.handle("onChatInput", function (e) {
    var message = e.getMessage()

    // Ignore normal commands
    if (message.startsWith("/") || message.startsWith(".")) {
        return e
    }

    var modifiedMessage = ""

    modifiedMessage = toShitChar(message)

    if (modifiedMessage.length > 100) {
        modifiedMessage = modifiedMessage.substring(0, 100)
    }

    packet.sendMessage(modifiedMessage)

    e.setCancelled(true)

    return e
})