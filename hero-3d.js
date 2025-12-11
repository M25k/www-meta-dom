// 3D Hero Animation using Three.js
// Renders the GLB model of the cathedral on the left and a VR user on the right, with parallax.

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // CAMERA POSITION
    camera.position.z = 5;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const blueLight = new THREE.PointLight(0x00f2ff, 2, 50);
    blueLight.position.set(-2, 2, 2);
    scene.add(blueLight);

    // GROUPS FOR PARALLAX
    const modelGroup = new THREE.Group();
    const userGroup = new THREE.Group();
    // Shift model group to the left and user group to the right
    scene.add(modelGroup);
    scene.add(userGroup);

    // LOAD GLB MODEL
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load('Koelner-Dom.glb', (gltf) => {
        const model = gltf.scene;
        // Adjust scale and position based on typical GLB sizes - may need tuning
        // Assuming model is roughly unit scale or needs normalization

        // Auto-center and normalize size nicely
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim; // Fit within ~3.5 units height

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale)); // Center it

        // Custom Material Override for "Tech" look (optional but cool)
        model.traverse((child) => {
            if (child.isMesh) {
                // Keep original geometry but maybe enhance material if needed
                // For now, let's stick to standard material but ensure it looks good
                child.material.metalness = 0.5;
                child.material.roughness = 0.4;
            }
        });

        // Position on the LEFT
        model.position.x = -3.5;
        model.position.y = -1;
        // Slight rotation to show off depth
        model.rotation.y = Math.PI / 8;

        modelGroup.add(model);
    }, undefined, (error) => {
        console.error('An error happened loading GLB:', error);
    });

    // LOAD PROJECTION USER IMAGE
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('img/vr-user-reaching.png', (texture) => {
        // Adjust aspect ratio based on image dimensions if known, otherwise assume approx square-ish/portrait
        // For upper body reach, typical landscape/square. Let's fix height and adapt width.
        const aspect = texture.image ? texture.image.width / texture.image.height : 1.5;
        const planeHeight = 5;
        const planeWidth = planeHeight * aspect;

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            blending: THREE.NormalBlending, // Normal blending to respect generated alpha if any (or we rely on black background)
            // Ideally we use Additive if background is black
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.9
        });

        const userMesh = new THREE.Mesh(geometry, material);
        // Position on the RIGHT
        userMesh.position.x = 3.5;
        userMesh.position.y = -0.5;
        userGroup.add(userMesh);
    });

    // PARTICLES (Wireframe parts simulation)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Cluster somewhat around the center/model
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Use LineSegments logic or just points that look like vertices
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Parallax Targets
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Model Group (Moves opposite to mouse for depth)
        // Rotate slightly
        modelGroup.rotation.y += 0.05 * (targetX - modelGroup.rotation.y);
        modelGroup.rotation.x += 0.05 * (targetY - modelGroup.rotation.x);

        // User Group (Moves slightly differently)
        userGroup.position.x += 0.03 * ((3.5 - targetX * 2) - userGroup.position.x); // Parallax X translation
        userGroup.rotation.z = targetX * 0.1; // Subtle tilt

        // Particles float
        particlesMesh.rotation.y = -mouseX * 0.0001;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 0.1;

        renderer.render(scene, camera);
    }

    animate();
});
