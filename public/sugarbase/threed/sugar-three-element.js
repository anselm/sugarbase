



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/// 3js helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let priorart = {}
let scenes = {}
let recycling = []

class SugarThreeElement extends HTMLElement {

	///
	/// Show a single piece of art at a time
	/// Caller needs to supply a unique id for the class of entity to show - largely as a paranonia check
	/// - art is the english local name (that is used for cache identification - effectively a URN)
	//  - url is the actual location on disk (multiple urls can refer to the same concept)

	async load_one_only(art=0,url=0) {

		// return if no change
		if(this.single_art == art && this.single_object) {
			return true
		}
		this.single_art = art

		// remove previous
		if(this.single_object) {
			this.remove(this.single_object)
			this.single_object = 0
		}

		// return if nothing to do
		if(!art || !art.length) {
			return false
		}

		this.single_object = await this.load(art,url,"solitary")

		return this.single_object ? true : false
	}

	async load(art=0,url=0,appid=0) {

		if(!art || !art.length) {
			return 0
		}

		// look in recycling first
		let obj = 0
		for(let i = 0; i < recycling.length; i++) {
			if(recycling[i].art == art) {
				console.log("Map: **** recycled " + art )
				obj = recycling[i]
				recycling.splice(i,1)
				this.scene.add(obj)
				return obj
			}
		}

		// make placeholder
		obj = new THREE.Group()
		obj.art = art
		obj.size = 1
		obj.ready_to_show = false

		// show a loading art
		let geometry = new THREE.SphereGeometry( 0.3,10,10 );
		//let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		let material = new THREE.MeshPhongMaterial( { color: 0x0033ff, specular: 0x555555, shininess: 30 } );
		let shape = new THREE.Mesh( geometry, material );
		obj.add( shape )

		// track who wanted this object for a recycling system
		obj.appid = appid

		this.scene.add(obj)

		// remember all scenes also
		scenes[this.scene.uuid] = this.scene

		// did i already start loading this art asset?
		let prior = priorart[art]

		// if loader is already pondering this asset don't try load it again
		if(prior) {
			// if loader is not done then just return - logic later on will resolve
			if(prior.mesh) {
				this._finalize(art,prior.mesh)
			}
		} else {
			// track that system is loading something
			priorart[art] = prior = { mesh:0 }

			// start async loader
			try {
				new THREE.GLTFLoader().load(url,(gltf) => {
					prior.mesh = gltf.scene
					prior.mesh.art = art
					this._finalize(art,prior.mesh)
				})
			} catch(err) {
				console.error(err)
				return 0
			}
		}

		return obj
	}

	///
	/// 3d assets in a scene may be optionally associated with a specific game entity - by id
	/// This is a way to find that art asset again as a preamble to doing something with it
	///

	find(appid) {
		let candidate = 0
		if(!this.scene || !this.scene.children) {
			console.error("something is wrong")
			console.log(this.scene)
			return
		}
		this.scene.children.forEach(obj => {
			if(obj.appid != appid) return
			if(candidate) {
				// if this happens it means that the same entity exists more than once! that's weird - just fix it
				console.error("ThreeSupport: more than one copy of id found " + appid)
				recycling.push(obj)
				this.scene.remove(obj)
				return
			}
			candidate = obj
		})
		return candidate
	}

	remove(obj) {
		recycling.push(obj)
		this.scene.remove(obj)
	}

	_finalize(art,mesh) {

		// for all scenes
		let keys = Object.keys(scenes)

		keys.forEach(key => {
			let scene = scenes[key]

			// decorate specific objects with loaded art - look in all scenes
			scene.children.forEach(obj => {

				// is this an object that is in need of art?
				if(!obj.art || obj.art != art || obj.art_loaded==art) return
				obj.art_loaded = obj.art

				// the idea here is that if an object changes in art i would remove the previous art
				// but i think i will use a recycling approach elsewhere - TODO revisit later
				// also this crashes
				//while(obj.children.length) {
				//	obj.children.remove(obj.children[0])
				//}

				// but do remove a cube that is temporary
				for(let i = 0; i < obj.children.length; i++) obj.children[i].visible = false

				// recompute bounds even if had computed it earlier - TODO could optimize this
				let boxhelper = new THREE.BoxHelper(mesh)
				boxhelper.geometry.computeBoundingBox()
				let bbox = obj.bbox = boxhelper.geometry.boundingBox
				let x = bbox.max.x - bbox.min.x
				let y = bbox.max.y - bbox.min.y
				let z = bbox.max.z - bbox.min.z

				// clone the mesh - TODO uncertain if this is as shallow as it could be - could be expensive
				let copied = mesh.clone()

				// also center mesh on its own vertices
				copied.position.set(-bbox.min.x-x/2,-bbox.min.y-y/2,-bbox.min.z-z/2)

				// add fresh clone - i have custom modified 3js to not blow up when cloning
				obj.add(copied)

				// write down the size so that a constant size rendering can be generated on demand
				obj.dimensions = { x:x, y:y, z:z }
				obj.size = Math.sqrt(x*x+y*y+z*z)

				// mark as ready to show
				obj.ready_to_show = true
			})
		})
	}

	render(gl,matrix,center,callback) {

		// allow for custom effects including basic placement on sugar related objects
		this.scene.children.forEach(callback)

		// reset camera
	    this.cameraTransform = new THREE.Matrix4().makeTranslation(center.x,center.y,center.z)
		this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(this.cameraTransform)

		// render
		this.renderer.state.reset()
		this.renderer.render(this.scene, this.camera)
	}

	// https://stackoverflow.com/questions/12168909/blob-from-dataurl
	dataURItoBlob(dataURI) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);

		// create a view into the buffer
		var ia = new Uint8Array(ab);

		// set the bytes of the buffer to the correct values
		for (var i = 0; i < byteString.length; i++) {
		  ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], {type: mimeString});
		return blob;

	}

	renderToBlob() {
		this.renderer.state.reset()

		let color = 0xffffff

		// white?
		this.renderer.setClearColor(color, 0);

		// white?
		this.scene.background = new THREE.Color(color);

		// white?
		//this.canvas.getContext("2d").fillStyle = color;
		//this.canvas.getContext("2d").fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.renderer.render(this.scene, this.camera)
		//this.renderer.domElement.toBlob((blob)=>{
		//	console.log(blob)
		//})
		let data = this.renderer.domElement.toDataURL( 'image/jpeg', 1.0 );
		let blob = this.dataURItoBlob(data)
		return blob
	}

	setup3d() {

		let bounds = this.canvas.getBoundingClientRect()
		let ratio = bounds.height ? bounds.width / bounds.height : 0

		// 3js renders higher quality if it knows the boundary here for some reason
		// https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js not celar whyy
		this.canvas.width = bounds.width
		this.canvas.height = bounds.height

		if(!bounds.width || !bounds.height) {
			console.error("Parent has no bounds!")
			console.log(bounds)
			console.log(this.parentNode)
			console.log(this.parentNode.getBoundingClientRect())
		}

		let near = 0.01
		let far = 100.0
		let clear = true

		// store state here
		let three = this

		// build a scene
		three.scene = new THREE.Scene();

		// toss in a camera - making sure to add to scene in this case
		three.camera = new THREE.PerspectiveCamera(45,ratio,near,far);
		three.camera.position.set(10,0,0)
		three.scene.add(three.camera)

		// a few lights
		three.scene.add( new THREE.AmbientLight( 0x808080 ) )

		var directionalLight = three.directionalLight = new THREE.DirectionalLight(0xffffff)
		directionalLight.position.set(0,1,0)
		directionalLight.target.position.set(0,0,0)
		three.scene.add(directionalLight)

		var directionalLight2 = new THREE.DirectionalLight(0xffffff)
		directionalLight2.position.set(0,1,0)
		three.scene.add(directionalLight2)

		let pointLight = new THREE.PointLight( 0xffffff );
		pointLight.position.set(0,0,0);
		three.camera.add(pointLight);

		// a renderer
		three.renderer = new THREE.WebGLRenderer({canvas:this.canvas, antialias: true, alpha:true})

		// not needed
		this.renderer.setPixelRatio(ratio)

		// weirdly it is a bit more clear if i set it again or if i set the canvas width/height above
		// but i don't want to coerce the canvas because then it fails to be responsive to view size changes
		three.renderer.setSize(bounds.width,bounds.height)

		// this.renderer.setViewport( 0, 0, bounds.width, bounds.height );

		this.renderer.autoClear = clear

		// orbit controls - which are badly written but will do - just focus on origin
		three.controls = new THREE.OrbitControls(three.camera,this.canvas)
		three.controls.minDistance = 5
		three.controls.maxDistance = 12
		//three.controls.maxPolarAngle = 0
		//three.controls.maxPolarAngle = Math.PI/2
		three.controls.autoRotate = true
		three.controls.update()

		// not used
		this.addEventListener('resize', function() {
			console.log("window size is " + window.innerWidth)
		})

		three.renderer.setAnimationLoop( () => {
			if(three.hidden) return	// is visible?
			if(this.offsetHeight == 0) return // more aggressive visibility check
			three.scene.children.forEach( obj => {
				if(!obj.size) return
				let scale = 10/obj.size
				obj.scale.set(scale,scale,scale)
			})
			three.controls.update();
			//this.renderer.state.reset()
			three.renderer.render(three.scene, three.camera)
		})

		return three
	}

	/*
	buildBox() {
		let geometry = new THREE.BoxGeometry( 0.3, 20.15, 0.3 )
		let material = new THREE.MeshBasicMaterial( {color: 0xcccccc} )
		let cube = new THREE.Mesh( geometry, material )
		cube.position.set(-10,0,-30)
		three.camera.add( cube )
		cube = new THREE.Mesh( geometry, material )
		cube.position.set(10,0,-30)
		three.camera.add( cube )
		cube = new THREE.Mesh( geometry, material )
		cube.position.set(0,10,-30)
		cube.rotation.set(0,0,Math.PI/2)
		three.camera.add( cube )
		cube = new THREE.Mesh( geometry, material )
		cube.position.set(0,-10,-30)
		cube.rotation.set(0,0,Math.PI/2)
		three.camera.add( cube )
	}
	*/

	///
	/// This is a variation of a scene builder  may merge with above
	///

	setup_gl(usecanvas,gl) {

		let three = this

		three.SCALE = 100 // I want objects to be 100 units across

		three.scene = new THREE.Scene();

		let width = window.innerWidth
		let height = window.innerHeight
		//this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		three.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 );
		//this.camera  = new THREE.Camera();
		three.scene.add(three.camera)

		three.scene.add( new THREE.AmbientLight( 0xc0c0c0 ) )

		var directionalLight = three.directionalLight = new THREE.DirectionalLight(0xffffff)
		directionalLight.target.position.set(0,0,0)
		three.scene.add(directionalLight)

		// roughly estimate sun position - where negative X is to the right
		let angle = new Date().getHours() / 24 * Math.PI
		directionalLight.position.set(-Math.cos(angle)*10,0,Math.sin(angle)) // -x is right, -z appears to be above, -y appears to be in front

		//var directionalLight2 = new THREE.DirectionalLight(0xffffff)
		//directionalLight2.position.set(0,1,0)
		//this.scene.add(directionalLight2)

		//let pointLight = new THREE.PointLight( 0xffffff );
		//pointLight.position.set(0,0,0);
		//this.camera.add(pointLight);

		three.renderer = new THREE.WebGLRenderer({
			canvas: usecanvas,
			context: gl,
			antialias: true
		})
		three.renderer.autoClear = false

		// TODO may want to avoid rendering in this case if map not shown

		/* due to math resolution picking just isn't going to work this way well...
		// picking
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		this.onclick = (event)=>{
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, this.camera )

			let hittables = []
			for(let i = 0; i < this.scene.children.length;i++) {
				if(this.scene.children[i].hittable) hittables.push(this.scene.children[i].hittable)
			}

			let hits = raycaster.intersectObjects(hittables, true)
			console.log(hittables)
			console.log(hits)
			if(hits.length && hits[0].object && hits[0].object.entity) {
				let entity = hits[0].object.entity
				window.history.pushState({},`/sugar-entity-detail/${entity.id}/${entity.name}`)
			}
		}
		*/
	}

	connectedCallback() {

		// this gets called when page is detached
		if(this.latched) return
		this.latched = 1

		this.buildDisplay()

console.log("rebuilding 3d view")
		if(this.url)
		this.load_one_only("anselm",this.url)

	}

	buildDisplay() {

		let screen_width = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
		let screen_height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
		let bounds = this.getBoundingClientRect()
		let parent_bounds = this.parentNode ? this.parentNode.getBoundingClientRect() : 0

		const ARBITRARY_MINIMUM = 64

		// fall back to full width of parent
		let width = "100%"

		// fall back to a reasonable screen occupying height
		let height = (screen_height * 0.33) + "px"

		// use boundary if sane
		if(bounds.width > ARBITRARY_MINIMUM) {
			width = bounds.width + "px"
		}

		// use boundary if sane
		if(bounds.height > ARBITRARY_MINIMUM) {
			width = bounds.width + "px"
		}

		// set size of this component
		this.style=`height:${height};width:${width};`

		// make a canvas that fully fills it
		this.canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' )
		this.canvas.style=`width:100%;height:100%;`

		this.appendChild(this.canvas)

		this.setup3d()

	}
}

customElements.define('sugar-three-element', SugarThreeElement )


