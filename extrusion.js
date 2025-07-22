export function extrudeFace(geometry, mesh, faceIndex, distance) {
    const positions = geometry.attributes.position.array;
    const indices = geometry.index.array;
    const normals = geometry.attributes.normal.array;

    const ia = indices[faceIndex * 3];
    const ib = indices[faceIndex * 3 + 1];
    const ic = indices[faceIndex * 3 + 2];

    const normal = new THREE.Vector3()
        .add(new THREE.Vector3(normals[ia * 3], normals[ia * 3 + 1], normals[ia * 3 + 2]))
        .add(new THREE.Vector3(normals[ib * 3], normals[ib * 3 + 1], normals[ib * 3 + 2]))
        .add(new THREE.Vector3(normals[ic * 3], normals[ic * 3 + 1], normals[ic * 3 + 2]))
        .normalize();

    const oldVertexCount = geometry.attributes.position.count;
    geometry.attributes.position.count += 3;
    const newPositions = new Float32Array(geometry.attributes.position.count * 3);
    newPositions.set(positions);
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    positions = newPositions;

    const newA = oldVertexCount;
    positions[newA * 3] = positions[ia * 3] + normal.x * distance;
    positions[newA * 3 + 1] = positions[ia * 3 + 1] + normal.y * distance;
    positions[newA * 3 + 2] = positions[ia * 3 + 2] + normal.z * distance;

    const newB = oldVertexCount + 1;
    positions[newB * 3] = positions[ib * 3] + normal.x * distance;
    positions[newB * 3 + 1] = positions[ib * 3 + 1] + normal.y * distance;
    positions[newB * 3 + 2] = positions[ib * 3 + 2] + normal.z * distance;

    const newC = oldVertexCount + 2;
    positions[newC * 3] = positions[ic * 3] + normal.x * distance;
    positions[newC * 3 + 1] = positions[ic * 3 + 1] + normal.y * distance;
    positions[newC * 3 + 2] = positions[ic * 3 + 2] + normal.z * distance;

    geometry.attributes.normal.count += 3;
    const newNormals = new Float32Array(geometry.attributes.normal.count * 3);
    newNormals.set(normals);
    geometry.setAttribute('normal', new THREE.BufferAttribute(newNormals, 3));
    normals = newNormals;

    normals[newA * 3] = normals[ia * 3];
    normals[newA * 3 + 1] = normals[ia * 3 + 1];
    normals[newA * 3 + 2] = normals[ia * 3 + 2];

    normals[newB * 3] = normals[ib * 3];
    normals[newB * 3 + 1] = normals[ib * 3 + 1];
    normals[newB * 3 + 2] = normals[ib * 3 + 2];

    normals[newC * 3] = normals[ic * 3];
    normals[newC * 3 + 1] = normals[ic * 3 + 1];
    normals[newC * 3 + 2] = normals[ic * 3 + 2];

    const oldIndexCount = geometry.index.count;
    geometry.index.count += 12; // Adjusted for 3 sides (each 2 triangles = 6 indices) + top (3)
    const newIndices = new Uint32Array(geometry.index.count);
    newIndices.set(indices);
    geometry.setIndex(new THREE.BufferAttribute(newIndices, 1));
    indices = newIndices;

    let idx = oldIndexCount;

    // New top face
    indices[idx++] = newA;
    indices[idx++] = newB;
    indices[idx++] = newC;

    // Side 1
    indices[idx++] = ia;
    indices[idx++] = ib;
    indices[idx++] = newB;
    indices[idx++] = ia;
    indices[idx++] = newB;
    indices[idx++] = newA;

    // Side 2
    indices[idx++] = ib;
    indices[idx++] = ic;
    indices[idx++] = newC;
    indices[idx++] = ib;
    indices[idx++] = newC;
    indices[idx++] = newB;

    // Side 3
    indices[idx++] = ic;
    indices[idx++] = ia;
    indices[idx++] = newA;
    indices[idx++] = ic;
    indices[idx++] = newA;
    indices[idx++] = newC;

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
}
