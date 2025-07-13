import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

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
let scene, camera, renderer, controls;

function init() {
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, camera_z);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    drawSpiral(); // Draw initial spiral
    animate();
}

function getCheckedLen() {
    let len = sequence.length;
    return len < 3 ? 3 : len;
}

function bigger() {
    let len = sequence.length;
    sequence.push(sequence[len - 2] + sequence[len - 1]);
    updateVal(sequence[len - 1]);
    render()
}

function smaller() {
    let len = getCheckedLen();
    sequence.splice(len - 1, 1);
    updateVal(sequence[len - 2]);
    render()
}

function updateVal(val) {
    document.getElementById("fib_val").innerText = val;
}

function drawSpiral() {
    let idx = 1
    let xAcc = 0, yAcc = 0, zAcc = 0, prevX, prevY, prevZ

    for (const fibVal of sequence.slice(1)) {
        prevX = xAcc
        prevY = yAcc
        prevZ = zAcc

        const dirX = [0, 1].includes(idx) ? 1 : -1;
        const dirY = [1, 2].includes(idx) ? -1 : 1;
        xAcc += fibVal * dirX;
        yAcc += fibVal * dirY;
        zAcc += fibVal

        const start = new THREE.Vector3(prevX, prevY, prevZ);
        const end = new THREE.Vector3(xAcc, yAcc, zAcc);

        const midX = (prevX + xAcc) / 2;
        const midY = (prevY + yAcc) / 2;
        const midZ = (prevZ + zAcc) / 2

        const dx = xAcc - prevX;
        const dy = yAcc - prevY;
        const len = Math.sqrt(dx * dx + dy * dy);
        const normX = -dy / len;
        const normY = dx / len;

        const arcHeight = fibVal * 0.65;
        const control = new THREE.Vector3(
            midX + normX * arcHeight,
            midY + normY * arcHeight,
            midZ
        );

        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: lineColor });
        const arc = new THREE.Line(geometry, material);

        // Squares
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(fibVal, fibVal, fibVal), 15)
        const edgesMat = new THREE.LineBasicMaterial({ color: lineColor });
        edges.translate(midX, midY, midZ);

        const mesh = new THREE.LineSegments(edges, edgesMat);

        scene.add(arc);
        scene.add(mesh)

        idx = (idx + 1) % 4;
    }
}


function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

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


function animate() {
    requestAnimationFrame(render);
}

init();
updateVal(sequence[sequence.length - 1]);

// Set button functions to be part of the window
document.getElementById("bigger").addEventListener("click", bigger);
document.getElementById("smaller").addEventListener("click", smaller);