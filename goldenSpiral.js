import * as THREE from './lib/three.module.min.js';

// Colors
const canvasBg = "#060E0E";
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
    for (const [idx, fibVal] of sequence.entries()) {
        const w = fibVal;

        const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, w, w), 15)
        const material = new THREE.LineBasicMaterial({ color: lineColor });
        const mesh = new THREE.LineSegments(geometry, material);

        // Translate by previous number
        mesh.position.x = fibVal * idx;
        mesh.position.y = 0;
        mesh.rotation.x = 0.5;
        mesh.rotation.y = 0.5;
        scene.add(mesh);
    }
}

function renderSpiral() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = camera_z;

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(canvasBg);
    scene.add(camera);
    scene.add(light);

    let objects = createSpiralMesh(scene);

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
        time *= 0.002;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // objects.forEach((obj, ndx) => {
        //     const speed = .1 + ndx * .05;
        //     const rot = time * speed;
        //     obj.rotation.x = rot;
        //     obj.rotation.y = rot;
        // });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

renderSpiral();
updateVal(sequence[sequence.length - 1]);

// Set button functions to be part of the window
window.bigger = bigger;
window.smaller = smaller;