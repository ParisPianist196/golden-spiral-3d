import * as THREE from './lib/three.module.min.js';

// Colors
const lineColor = "#BFDBF7";

// Camera consts
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera_z = 120;

// Lighting consts
const color = 0xFFFFFF;
const intensity = 3;

// Fibonacci
let sequence = [0, 1];

function getCheckedLen() {
    let len = sequence.length;
    return len < 3 ? 3 : len;
}

function bigger() {
    let len = sequence.length;
    sequence.push(sequence[len - 2] + sequence[len - 1]);
    updateVal(sequence[len - 1]);
    renderSpiral()
}

function smaller() {
    let len = getCheckedLen();
    sequence.splice(len - 1, 1);
    updateVal(sequence[len - 2]);
    renderSpiral()
}

function updateVal(val) {
    document.getElementById("fib_val").innerText = val;
}

function createSpiralMesh(scene) {
    let pos = false;
    const axis = ['x', 'y', 'z']
    let idx = 1
    let xDelta, yDelta

    let xAcc = 0, yAcc = 0, rotAcc = 0; // accumulators

    for (const fibVal of sequence.slice(1)) {
        const geometry = new THREE.BoxGeometry(fibVal, fibVal, fibVal);
        // geometry.translate(fibVal / 2, fibVal / 2, 0);

        const material = new THREE.MeshBasicMaterial({ color: lineColor });
        const mesh = new THREE.Mesh(geometry, material);

        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edgeLines = new THREE.LineSegments(edges, lineMaterial);

        mesh.add(edgeLines);

        xAcc += (fibVal * ([0, 1].includes(idx) ? 1 : -1));
        yAcc += (fibVal * ([1, 2].includes(idx) ? -1 : 1));
        rotAcc += Math.PI / 2

        mesh.position.set(xAcc, yAcc, 0);
        mesh.rotateY(rotAcc)
        scene.add(mesh);
        idx += 1
        if (idx > 3) idx = 0
    }

}
function drawSpiral(scene) {
    let idx = 1
    let xAcc = 0, yAcc = 0, prevX, prevY

    for (const fibVal of sequence.slice(1)) {
        prevX = xAcc
        prevY = yAcc

        // Update accumulators based on direction
        const dirX = [0, 1].includes(idx) ? 1 : -1;
        const dirY = [1, 2].includes(idx) ? -1 : 1;
        xAcc += fibVal * dirX;
        yAcc += fibVal * dirY;

        const start = new THREE.Vector3(prevX, prevY, 0);
        const end = new THREE.Vector3(xAcc, yAcc, 0);

        // Compute midpoint
        const midX = (prevX + xAcc) / 2;
        const midY = (prevY + yAcc) / 2;

        // Offset control point perpendicular to segment
        const dx = xAcc - prevX;
        const dy = yAcc - prevY;
        const len = Math.sqrt(dx * dx + dy * dy);
        const normX = -dy / len; // rotate 90° clockwise
        const normY = dx / len;

        const arcHeight = fibVal * 0.5; // controls curvature
        const control = new THREE.Vector3(
            midX + normX * arcHeight,
            midY + normY * arcHeight,
            0
        );

        // Create arc
        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: lineColor });
        const arc = new THREE.Line(geometry, material);

        scene.add(arc);

        idx = (idx + 1) % 4;
    }
}


function renderSpiral() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, camera_z) // zDistance > 0
    camera.lookAt(0, 0, 0)
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    const scene = new THREE.Scene();
    scene.add(camera);
    scene.add(light);

    let objects = drawSpiral(scene);

    function resizeRendererToDisplaySize() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    function render(time) {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

renderSpiral();
updateVal(sequence[sequence.length - 1]);

// Set button functions to be part of the window

document.getElementById("bigger").addEventListener("click", bigger);
document.getElementById("smaller").addEventListener("click", smaller);