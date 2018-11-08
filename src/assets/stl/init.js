var camera, cameraTarget, scene, renderer,controlls,loader,material,mesh;
var file = decodeURI(location.href.split('=')[1]);
// var file = location.href.split('=')[1];
function init() {
    //camera
    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 0, 500 );

    cameraTarget = new THREE.Vector3( 0, 0, 0 );
    camera.lookAt( cameraTarget );
    
    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xEEEEEE );
    scene.add(camera);

    // renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('mainCanvas')
    });

    renderer.setSize( window.innerWidth, window.innerHeight );

    // ASCII file
    //导入dayan.stl
    loader = new THREE.STLLoader();
    loader.load(file, function ( geometry ) {

        material = new THREE.MeshPhongMaterial( { color: 0x666666, specular: 0x111111, shininess: 200 } );
        mesh = new THREE.Mesh( geometry, material );

        mesh.position.set( 500, -500, -500 );
        mesh.rotation.set( -Math.PI/2,  0, 8 );
        //Math.PI
        mesh.scale.set( 1, 1, 1 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add( mesh );
        render();
        
    } );
    

    // Lights
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
    
    //controlls
    controls = new THREE.OrbitControls( camera ,renderer.domElement );
    controls.addEventListener( 'change', render );    
}

function addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    var d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = -0.005;

}

function render() {
    renderer.render( scene, camera );
}