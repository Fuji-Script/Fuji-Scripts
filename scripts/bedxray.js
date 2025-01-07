var module = rise.registerModule("Bed Xray with Pathfinding", "Detects and highlights beds, tracks the closest bed, and shows blocks to break.");

module.registerSetting("number", "Range", 10, 8, 64);
module.registerSetting("color", "Bed Color", "#FF0000");
module.registerSetting("color", "Closest Bed Color", "#00FF00");
module.registerSetting("color", "Path Color", "#FFFF00");

function isBedBlock(block) {
    return block.getId() === 26;
}

function calculateDistance(playerPos, targetPos) {
    var dx = playerPos.x - targetPos.x;
    var dy = playerPos.y - targetPos.y;
    var dz = playerPos.z - targetPos.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function renderCube(blockPos, size, color) {
    var position = blockPos.getPosition();
    var vertices = [
        { x: position.x, y: position.y, z: position.z },
        { x: position.x + size, y: position.y, z: position.z },
        { x: position.x + size, y: position.y, z: position.z + size },
        { x: position.x, y: position.y, z: position.z + size },
        { x: position.x, y: position.y + size, z: position.z },
        { x: position.x + size, y: position.y + size, z: position.z },
        { x: position.x + size, y: position.y + size, z: position.z + size },
        { x: position.x, y: position.y + size, z: position.z + size }
    ];

    var lines = [
        [vertices[0], vertices[1]],
        [vertices[1], vertices[2]],
        [vertices[2], vertices[3]],
        [vertices[3], vertices[0]],
        [vertices[4], vertices[5]],
        [vertices[5], vertices[6]],
        [vertices[6], vertices[7]],
        [vertices[7], vertices[4]],
        [vertices[0], vertices[4]],
        [vertices[1], vertices[5]],
        [vertices[2], vertices[6]],
        [vertices[3], vertices[7]]
    ];

    lines.forEach(function(line) {
        render.drawLine3D(rise.newVec3(line[0].x, line[0].y, line[0].z), rise.newVec3(line[1].x, line[1].y, line[1].z), color, 3);
    });
}

function renderPathToBed(playerPos, bedPos, color) {
    var pathPoints = [playerPos, bedPos];
    for (var i = 0; i < pathPoints.length - 1; i++) {
        render.drawLine3D(
            rise.newVec3(pathPoints[i].x, pathPoints[i].y, pathPoints[i].z),
            rise.newVec3(pathPoints[i + 1].x, pathPoints[i + 1].y, pathPoints[i + 1].z),
            color,
            2
        );
    }
}

module.handle("onRender3D", function () {
    var range = module.getSetting("Range");
    var bedColor = module.getSetting("Bed Color");
    var closestBedColor = module.getSetting("Closest Bed Color");
    var pathColor = module.getSetting("Path Color");
    var playerPos = player.getPosition();
    var closestBedPos = null;
    var closestDistance = Number.MAX_VALUE;

    for (var x = playerPos.x - range; x <= playerPos.x + range; x++) {
        for (var y = playerPos.y - range; y <= playerPos.y + range; y++) {
            for (var z = playerPos.z - range; z <= playerPos.z + range; z++) {
                var blockPos = world.newBlockPos(x, y, z);
                var block = blockPos.getBlock();

                if (isBedBlock(block)) {
                    var distance = calculateDistance(playerPos, blockPos.getPosition());
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestBedPos = blockPos;
                    }

                    renderCube(blockPos, 1, bedColor);
                }
            }
        }
    }

    if (closestBedPos !== null) {
        renderCube(closestBedPos, 1, closestBedColor);
        renderPathToBed(playerPos, closestBedPos.getPosition(), pathColor);
    }
});
