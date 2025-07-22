export function createHelpers(geometry, scene) {
    let vertexHelpers = [];
    let edgeHelpers = [];

    // Clear old
    // Note: In updateHelpers, we remove old ones before calling this.

    // Vertex helpers
    const vertexGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3(positions.array[i*3], positions.array[i*3+1], positions.array[i*3+2]);
        const helper = new THREE.Mesh(vertexGeometry, vertexMaterial);
        helper.userData.vertexIndex = i;
        helper.position.copy(vertex);
        scene.add(helper);
        vertexHelpers.push(helper);
    }

    // Edge helpers
    const edges = new THREE.EdgesGeometry(geometry);
    const positionsArray = edges.attributes.position.array;
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    for (let i = 0; i < positionsArray.length; i += 6) {
        const start = new THREE.Vector3(positionsArray[i], positionsArray[i+1], positionsArray[i+2]);
        const end = new THREE.Vector3(positionsArray[i+3], positionsArray[i+4], positionsArray[i+5]);
        const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const edgeLine = new THREE.Line(lineGeo, edgeMaterial);
        edgeLine.userData.edgeIndices = [i/3, i/3 + 1];
        scene.add(edgeLine);
        edgeHelpers.push(edgeLine);
    }

    return { vertexHelpers, edgeHelpers };
}
