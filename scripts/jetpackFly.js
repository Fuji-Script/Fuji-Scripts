// Author: MrCobbert
// Version: 1.1
// Description: A vanilla jetpack fly module with dynamic speed adjustment

var module = rise.registerModule("Jetpack Fly", "Hold space to fly upwards with dynamic speed");

module.registerSetting("number", "Timer Speed", 1.0, 0.1, 2.0, 0.1);
module.registerSetting("number", "Jetpack Speed", 1.0, 0.5, 3.0, 0.1);

var currentSpeed = 1.0;
var maxSpeed = 0;
var increasing = true;

module.handle("onTick", function() {
    if (input.isKeyBindJumpDown()) {        
        mc.setTimerSpeed(module.getSetting("Timer Speed"));
        
        var motionX = player.getMotion().getX() * 1.05;
        var motionZ = player.getMotion().getZ() * 1.05;
        
        motionX = Math.max(Math.min(motionX, 0.6), -0.6);
        motionZ = Math.max(Math.min(motionZ, 0.6), -0.6);
        
        player.setMotionX(motionX);
        player.setMotionZ(motionZ);

        if (increasing) {
            currentSpeed += 0.05;
            if (currentSpeed >= module.getSetting("Jetpack Speed")) {
                increasing = false;
            }
        } else {
            currentSpeed = module.getSetting("Jetpack Speed") * (0.8 + Math.random() * 0.4);
        }
        
        player.setMotionY(player.getMotion().getY() + (currentSpeed * 0.1));
    } else {
        mc.setTimerSpeed(1.0);
        currentSpeed = 1.0;
        increasing = true;
    }
});

script.handle("onUnload", function() {
    mc.setTimerSpeed(1.0);
    module.unregister();
});
