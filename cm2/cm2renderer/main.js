const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2.13, window.innerHeight / 1.75);
document.querySelector('.box2').appendChild(renderer.domElement);

camera.position.z = 5;

const fragmentShaderSource = `
    varying lowp vec3 vColor;
    varying highp vec3 vNormal;

    void main(void) {
        highp float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
        highp vec3 shadedColor = mix(vColor, vColor * 0.5, intensity);

        gl_FragColor = vec4(shadedColor, 1.0);
    }
`;
function createCube(x, y, z, rgb, opaque) {
    const uniforms = {
        color: { value: new THREE.Color(rgb[0], rgb[1], rgb[2]) }
    };

    const vertexShader = `
        varying vec3 vNormal;

        void main() {
            vNormal = normalMatrix * normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec3 color;
        varying vec3 vNormal;

        void main(void) {
            float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
            vec3 shadedColor = color * max(intensity, 0.2);

            gl_FragColor = vec4(shadedColor, ${opaque ? '0.5' : '1.0'}); // Adjust the alpha value for transparency
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        transparent: true,
        opacity: opaque ? 0.5 : 1.0
    });

    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(x, y, z);

    return cube;
}


// Camera movement functions
function moveCameraForward(distance) {
    const deltaZ = Math.cos(camera.rotation.y) * distance;
    const deltaX = Math.sin(camera.rotation.y) * distance;
    camera.position.x -= deltaX;
    camera.position.z -= deltaZ;
}

function moveCameraBackward(distance) {
    const deltaZ = Math.cos(camera.rotation.y) * distance;
    const deltaX = Math.sin(camera.rotation.y) * distance;
    camera.position.x += deltaX;
    camera.position.z += deltaZ;
}

function moveCameraLeft(distance) {
    camera.position.x -= Math.sin(camera.rotation.y + Math.PI / 2) * distance;
    camera.position.z -= Math.cos(camera.rotation.y + Math.PI / 2) * distance;
}

function moveCameraRight(distance) {
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * distance;
    camera.position.z += Math.cos(camera.rotation.y + Math.PI / 2) * distance;
}
function moveCameraUp(distance) {
    camera.position.y += distance;
}

function moveCameraDown(distance) {
    camera.position.y -= distance;
}

function rotateCameraLeft(angle) {
    camera.rotation.y += angle;
}

function rotateCameraRight(angle) {
    camera.rotation.y -= angle;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
window.addEventListener('resize', function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    const aspectRatio = targetWidth / targetHeight;
    const scale = Math.min(newWidth / targetWidth, newHeight / targetHeight);
    const scaledWidth = targetWidth * scale;
    const scaledHeight = targetHeight * scale;

    renderer.setSize(scaledWidth, scaledHeight);
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
});
