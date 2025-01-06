var module = rise.registerModule("VelocityBypass", "Hylex anticheat sucks fr");

module.registerSetting("boolean", "Jump", true);
module.registerSetting("number", "Hurt9", 0.8, 0, 1, 0.01);
module.registerSetting("number", "Hurt8", 0.11, 0, 1, 0.01);
module.registerSetting("number", "Hurt7", 0.4, 0, 1, 0.01);
module.registerSetting("number", "Hurt4", 0.37, 0, 1, 0.01);

script.handle("onUnload", function() {
    module.unregister();
});

// Attack event handler for velocity modifications
module.handle("onAttack", function(e) {
    if (!player.isMoving() || !player.isSprinting()) {
        return;
    }
    
    var motion = player.getMotion();
    var hurtTime = player.getHurtTime();
    
    switch (hurtTime) {
        case 9:
            player.setMotionX(motion.getX() * module.getSetting("Hurt9"));
            player.setMotionZ(motion.getZ() * module.getSetting("Hurt9"));
            break;
        case 8:
            player.setMotionX(motion.getX() * module.getSetting("Hurt8"));
            player.setMotionZ(motion.getZ() * module.getSetting("Hurt8"));
            break;
        case 7:
            player.setMotionX(motion.getX() * module.getSetting("Hurt7"));
            player.setMotionZ(motion.getZ() * module.getSetting("Hurt7"));
            break;
        case 4:
            player.setMotionX(motion.getX() * module.getSetting("Hurt4"));
            player.setMotionZ(motion.getZ() * module.getSetting("Hurt4"));
            break;
    }
});

// Separate jump handler
module.handle("onPreMotion", function(e) {
    var shouldJump = player.getHurtTime() > 5;
    var canJump = player.isOnGround();
    
    if (module.getSetting("Jump") && shouldJump && canJump) {
        player.jump();
    }
});