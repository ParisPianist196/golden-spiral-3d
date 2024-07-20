import * as THREE from './three.module.min.js';

// Camera consts
const fov = 40;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera_z = 120;

// Lighting consts
const color = 0xFFFFFF;
const intensity = 3;

export default function renderSpiral() {
    console.log(curNum);
    let objects = [];

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = camera_z;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);

    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const w = 40;
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, w, w), 15)
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.LineSegments(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;

    scene.add(mesh);
    objects.push(mesh);

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

        objects.forEach((obj, ndx) => {
            const speed = .1 + ndx * .05;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}