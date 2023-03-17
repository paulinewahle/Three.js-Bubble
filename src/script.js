import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const hdrTextureURL = new URL('img/forest.hdr', import.meta.url);


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.sphere')

// Scene
const scene = new THREE.Scene()


// Objects
const geometry = new THREE.SphereBufferGeometry( .8, 60, 60 );

// Materials
const material = new THREE.MeshPhysicalMaterial()

material.metalness = 2
material.roughness = 2 
material.transparent = true
material.opacity = 0.5
//material.color = new THREE.Color(0xffffff)
//material.transmission = 3
//material.thickness = 3
//material.opacity = 1
//material.ior = 2.33

/*
material.color = new THREE.Color(0xffffff)
material.transmission = 1
material.opacity = 1
material.metalness = 0
material.roughness = 0
material.ior = 1.52
material.thickness = 0.1
material.specularIntensity = 1
material.specularColor = 0xffffff
material.lightIntensity = 1
material.exposure = 1
*/
// Mesh
const sphere = new THREE.Mesh( geometry, material );

scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//hdr decoding
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

//RGBELoader
const loader = new RGBELoader();
loader.load(hdrTextureURL, function(texture){
    texture.mapping = THREE. EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()