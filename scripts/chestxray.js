var module = rise.registerModule("ChestXray", "Detects and highlights chests within a specified range.");

module.registerSetting("number", "Range", 10, 8, 64);
module.registerSetting("color", "Chest Color", "#FF0000");

function isChestBlock(block) {
    return block.getId() === 54 || block.getId() === 146;
}

function calculateDistance(playerPos, targetPos) {
    var dx = playerPos.x - targetPos.x;
    var dy = playerPos.y - targetPos.y;
    var dz = playerPos.z - targetPos.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function createCubeVertices(blockPos, size) {
    var position = blockPos.getPosition();
    var x = position.x;
    var y = position.y;
    var z = position.z;

    return [
        { x: x, y: y, z: z },
        { x: x + size, y: y, z: z },
        { x: x + size, y: y, z: z + size },
        { x: x, y: y, z: z + size },
        { x: x, y: y + size, z: z },
        { x: x + size, y: y + size, z: z },
        { x: x + size, y: y + size, z: z + size },
        { x: x, y: y + size, z: z + size }
    ];
}

function createCubeLines(vertices) {
    return [
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
    ].map(function(line) {
        return [
            rise.newVec3(line[0].x, line[0].y, line[0].z),
            rise.newVec3(line[1].x, line[1].y, line[1].z)
        ];
    });
}

function renderCube(blockPos, size, color) {
    var vertices = createCubeVertices(blockPos, size);
    var lines = createCubeLines(vertices);

    lines.forEach(function(line) {
        render.drawLine3D(line[0], line[1], color, 3);
    });
}

module.handle("onRender3D", function () {
    var range = module.getSetting("Range");
    var chestColor = module.getSetting("Chest Color");
    var playerPos = player.getPosition();

    for (var x = playerPos.x - range; x <= playerPos.x + range; x++) {
        for (var y = playerPos.y - range; y <= playerPos.y + range; y++) {
            for (var z = playerPos.z - range; z <= playerPos.z + range; z++) {
                var blockPos = world.newBlockPos(x, y, z);
                var block = blockPos.getBlock();

                if (isChestBlock(block)) {
                    renderCube(blockPos, 1, chestColor);
                }
            }
        }
    }
});
