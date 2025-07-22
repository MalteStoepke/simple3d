import { createHelpers } from './helpers.js';
import { extrudeFace } from './extrusion.js';

function logError(msg) {
    document.getElementById('error').innerText = msg;
    console.error(msg);
}

try {
    console.log('Main script started');

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xadd8e6); // Light blue background for testing
    document.body.appendChild(renderer.domElement);
    console.log('Renderer created');

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mesh (cube)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    console.log('Cube added');

    // Wireframe
    let wireframe = new THREE.WireframeGeometry(geometry);
    let line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
    mesh.add(line);

    camera.position.z = 5;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedFaceIndex = -1;
    let selectedVertexIndex = -1;
    let selectedEdge = null;
    let mode = 'face';

    // Helpers
    let vertexHelpers = [];
    let edgeHelpers = [];
    function updateHelpers() {
        ({ vertexHelpers, edgeHelpers } = createHelpers(geometry, scene));
    }
    updateHelpers();

    // GUI
    const gui = new dat.GUI();
    const params = {
        mode: 'face',
        extrudeDistance: 0.5,
        applyExtrude: function() {
            if (mode === 'face' && selectedFaceIndex !== -1) {
                extrudeFace(geometry, mesh, selectedFaceIndex, params.extrudeDistance);
                selectedFaceIndex = -1;
                // Update wireframe and helpers
                mesh.remove(line);
                wireframe = new THREE.WireframeGeometry(geometry);
                line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }));
                mesh.add(line);
                updateHelpers();
            } else if (mode === 'vertex' && selectedVertexIndex !== -1) {
                console.log('Vertex selected: ' + selectedVertexIndex);
                selectedVertexIndex = -1;
            } else if (mode === 'edge' && selectedEdge !== null) {
                console.log('Edge selected');
                selectedEdge =
