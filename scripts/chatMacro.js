// Author: MrCobbert & Leo728
// Version: 1.2
// Description: A combined module for sending custom chat messages and bypassing chat filters.

var module = rise.registerModule(
  "Chat Macro & Bypass",
  "Combines chat macro functionality with chat filter bypass."
);


module.registerSetting("string", "Message", "Rise on Top!");
module.registerSetting("boolean", "Repeat", false);
module.registerSetting("boolean", "Bypass (MiniBlox)", false);
module.registerSetting("boolean", "On Kill", false);
module.registerSetting("number", "Delay (s)", 1, 0, 10, 0.1);


module.registerSetting("boolean", "Enable Bypass", true);

var lastMessageTime = 0;
var messageCounter = 0;

function getModifiedMessage(baseMessage) {
  if (module.getSetting("Bypass (MiniBlox)") && messageCounter % 2 === 1) {
    return baseMessage + "!";
  }
  return baseMessage;
}

function toShitChar(message) {
  var field1 = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  var field2 = "ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍ０１２３４５６７８９";
  var result = "";

  for (var i = 0; i < message.length; i++) {
    var char = message.charAt(i);
    var index = field1.indexOf(char);
    result += (index !== -1) ? field2.charAt(index) : char;
  }

  return result;
}

module.handle("onTick", function () {
  if (module.getSetting("On Kill")) return;

  if (!module.getSetting("Repeat")) {
    var message = getModifiedMessage(module.getSetting("Message"));
    if (module.getSetting("Enable Bypass")) {
      message = toShitChar(message);
    }
    player.message(message);
    module.setEnabled(false);
    return;
  }

  var currentTime = Date.now();
  var delaySeconds = module.getSetting("Delay (s)");

  if (currentTime - lastMessageTime >= delaySeconds * 1000) {
    var message = getModifiedMessage(module.getSetting("Message"));
    if (module.getSetting("Enable Bypass")) {
      message = toShitChar(message);
    }
    player.message(message);
    lastMessageTime = currentTime;
    messageCounter++;
  }
});

module.handle("onKill", function (victim) {
  if (!module.getSetting("On Kill")) return;

  var message = getModifiedMessage(module.getSetting("Message"));
  if (module.getSetting("Enable Bypass")) {
    message = toShitChar(message);
  }
  player.message(message);
  messageCounter++;
});

module.handle("onChatInput", function (e) {
  if (!module.getSetting("Enable Bypass")) return e;

  var message = e.getMessage();
  if (message.startsWith("/") || message.startsWith(".")) {
    return e;
  }

  var modifiedMessage = toShitChar(message);
  if (modifiedMessage.length > 100) {
    modifiedMessage = modifiedMessage.substring(0, 100);
  }

  packet.sendMessage(modifiedMessage);
  e.setCancelled(true);
  return e;
});

script.handle("onUnload", function () {
  module.unregister();
});
