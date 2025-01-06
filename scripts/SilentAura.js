var module = rise.registerModule("SilentAura", "BetterAura");

module.registerSetting("number", "Range", 3, 3, 6, 0.1);
module.registerSetting("number", "CPS", 10, 1, 20, 0.1);
module.registerSetting("mode", "Rotations", "Legit", ["Legit", "Snap", "None"]);
module.registerSetting("number", "TurnSpeed", 180, 1, 180);
module.registerSetting("boolean", "Players", true);
module.registerSetting("boolean", "Invisibles", false);
module.registerSetting("boolean", "RayCast", true);
module.registerSetting("boolean", "Movement Correction", false);
module.registerSetting("number", "StartAimingDistance", 5, 3, 10, 0.1);

var lastAttackTime = Date.now();

module.handle("onPreMotion", function(e) {
    var entity = world.getTargetEntity(module.getSetting("StartAimingDistance"));
    if (!entity || !isValidTarget(entity)) return e;
    
    var distance = player.getDistanceToEntity(entity);
    if (distance <= module.getSetting("StartAimingDistance")) {
        handleAiming(entity);
    }
    
    if (distance <= module.getSetting("Range")) {
        handleAttacking(entity);
    }
    
    return e;
});

function handleAiming(entity) {
    var rotationMode = module.getSetting("Rotations");
    if (rotationMode !== "None") {
        var rotations = player.calculateRotations(entity);
        var randomOffset = (Math.random() - 0.5) * 4;
        
        rotations.setX(rotations.getX() + randomOffset);
        rotations.setY(rotations.getY() + randomOffset);
        
        if (rotationMode === "Legit") {
            player.setRotation(rotations, module.getSetting("TurnSpeed"), module.getSetting("Movement Correction"));
        } else if (rotationMode === "Snap") {
            player.setRotation(rotations, 180, false);
        }
    }
}

function handleAttacking(entity) {
    var currentTime = Date.now();
    var cps = module.getSetting("CPS");
    var minDelay = 1000 / (cps + (Math.random() * 3));
    
    if (currentTime - lastAttackTime >= minDelay && Math.random() > 0.15) {
        if (!module.getSetting("RayCast") || player.mouseOverEntity(entity, module.getSetting("Range"))) {
            player.swingItem();
            player.attackEntity(entity);
            lastAttackTime = currentTime;
        }
    }
}

function isValidTarget(entity) {
    if (!entity || !entity.isLiving() || entity.isDead() || entity.equals(player)) return false;
    if (entity.isPlayer() && !module.getSetting("Players")) return false;
    if (entity.isInvisible() && !module.getSetting("Invisibles")) return false;
    return true;
}

script.handle("onUnload", function() {
    module.unregister();
});
