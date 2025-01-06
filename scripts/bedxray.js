// MADE BY GOOFY CAT
// SCRIPT IS EDITED ORIGINAL SCRIPT IS KASHS XRAY SCRIPT
// SCRIPTS PATHFINDING IS NOT VERY GOOD I WILL FIX IT LATER
var module = rise.registerModule("Bed Xray with Pathfinding", "Detects and highlights beds, tracks the closest bed, and shows blocks to break.");

module.registerSetting("number", "Range", 10, 8, 64);

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

function isBedBlock(block) {
    return block.getId() === 26;
}

function calculateDistance(playerPos, bedPos) {
    var dx = playerPos.x - bedPos.x;
    var dy = playerPos.y - bedPos.y;
    var dz = playerPos.z - bedPos.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isBreakableBlock(block) {
    var blockId = block.getId();
    return blockId !== 0 && blockId !== 26;
}

function getPathToBed(playerPos, bedPos, stepSize) {
    var path = [];
    var step = 0;
    var dx = bedPos.x - playerPos.x;
    var dy = bedPos.y - playerPos.y;
    var dz = bedPos.z - playerPos.z;
    var distance = calculateDistance(playerPos, bedPos);

    var stepsCount = Math.ceil(distance / stepSize);
    var direction = {
        x: dx / distance,
        y: dy / distance,
        z: dz / distance
    };

    for (step = 0; step <= stepsCount; step++) {
        var xPath = playerPos.x + direction.x * step * stepSize;
        var yPath = playerPos.y + direction.y * step * stepSize;
        var zPath = playerPos.z + direction.z * step * stepSize;
        path.push(world.newBlockPos(Math.floor(xPath), Math.floor(yPath), Math.floor(zPath)));
    }

    return path;
}

module.handle("onRender3D", function () {
    var range = module.getSetting("Range");
    var playerPos = player.getPosition();
    var closestBedPos = null;
    var closestDistance = Number.MAX_VALUE;
    var color = [255, 0, 0];
    var pathColor = [255, 255, 0];

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

                    renderCube(blockPos, 1, color);
                }
            }
        }
    }

    if (closestBedPos !== null) {
        renderCube(closestBedPos, 1, [0, 255, 0]);

        var bedPos = closestBedPos.getPosition();

        var path = getPathToBed(playerPos, bedPos, 0.5);

        path.forEach(function(blockPos) {
            var block = blockPos.getBlock();
            if (isBreakableBlock(block)) {
                renderCube(blockPos, 0.8, pathColor);
            }
        });
    }
});
