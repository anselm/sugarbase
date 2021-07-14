
class SugarImageEdit extends HTMLElement {

	async entityChanged(entity) {

		// paint image upload interface

		this.style.background="var(--forearea)"
		this.innerHTML =
			`<input id="uploader-filehelper" hidden type="file" accept="image/*;capture=camera"></input>
			<div hidden id="uploader-preview" class="postimage" style="position:relative;background-color: hsl(${360*Math.random()},${25+70*Math.random()}%,${85+10*Math.random()}%);">
				<div id="uploader-discard" style="position:absolute;right:0;">❌</div>
			</div>
			<div style="display:flex">
				<div style="flex:auto"></div>
				<button class=bigbutton id="uploader-choose">Set Photo 📸</button>
			</div>
			`

		this.removeimage = this.querySelector("#uploader-discard")
		this.addimage = this.querySelector("#uploader-choose")
		this.filewidget = this.querySelector("input[type=file]")
		this.preview = this.querySelector("#uploader-preview")

		// if there is an entity and an image then show that image as current right now
		if(entity && entity.depiction && entity.depiction.length) {
			await SugarBase.EntityVolatile(entity)
			this.preview.style.backgroundImage = `url(${entity.volatile.art})`
			this.preview.hidden = false
			this.addimage.hidden = true
		}

		// add a listener to later handle a user request to remove the attached image
		this.removeimage.onclick = (e) => {
			if(!entity) return
			delete this.file // wipe  thing
			entity.depiction = "" // wipe depiction in actual caller
			this.preview.hidden = true
			this.addimage.hidden = false
			this.failedtocreate = false
		}

		// add a listener to forward user click to actual handler
		// TODO prevent duplicate clicks?
		this.addimage.onclick = (e) => {
			this.filewidget.click()
		}

		// add a listener to handle actual load requests
		this.filewidget.addEventListener('change',this.handleLoad1.bind(this))

		// clear failed to create state
		this.failedtocreate = false
		this.error_message = 0
		this.entity = entity
	}

	error(str) {
		if(!str) {
			this.failedtocreate = false
			this.error_message = 0
			return this.entity
		}
		console.error(str)
		this.error_message = str
		this.failedtocreate = true
		return {error:str}
	}

	handleLoad1(e) {
		//e.preventDefault()

		// flush state - start off in a failure state
		this.image1 = 0
		this.image2 = 0
		this.image2 = 0
		this.failedtocreate = true
		this.error_message = "failed to start creation - unknown error"

		// any thing to load?
		this.asset = this.filewidget.files.length ? this.filewidget.files[0] : 0
		if (!this.asset || !this.asset.type.startsWith('image/')) return 0

		// ok load it
		const reader = new FileReader()
		reader.onload = this.handleLoad2.bind(this)
		reader.readAsDataURL(this.asset)
		return 0
	}

	handleLoad2(e) {
		// now i want user supplied content as an image...
		this.image = new Image()
		this.image.src = e.target.result
		this.image.onload = this.handleLoad3.bind(this)
		return 0
	}

	handleLoad3(e) {
		if(!this.image || !this.image.width || !this.image.height) {
			return this.error("failed to load image")
		}
		if(!this.asset) {
			return this.error("what?")
		}
		let maxWidth = 4096
		let maxHeight = 4096
		if(this.image.width > maxWidth || this.image.height > maxHeight) {
			return this.error("Image is too big on either axis")
		}
		if(this.image.width < 32 || this.image.height < 32) {
			return this.error("image is too small on one axis")
		}
		if(this.image.height > this.image.width * 8) {
			return this.error("image is too tall")
		}
		if(this.image.width > this.image.height * 8) {
			return this.error("image is too wide")
		}

		// print first image - the entire image to a buffer to escape it out of whatever weird format it is in
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.image.width
		this.canvas.height = this.image.height
		let ctx = this.canvas.getContext("2d")
		ctx.drawImage(this.image,0,0,this.canvas.width,this.canvas.height)
		this.canvas.toBlob((blob)=>{this.handleLoad4(blob)})
	}

	handleLoad4(blob) {

		this.image1 = {
			kind:ENTITY.IMAGE,
			width:this.image.width,
			height:this.image.height,
			blob:blob,
			hash: SparkMD5.hash(this.image.src)
		}

		// i want to constrain the maximum dimensions a bit for a target render
		// but i want to keep the original dimensions
		// and if it is small enough i want to keep everything
		// also i render things to a copy so i can deal with heic

		// first i'll take the larger axis and reduce it to say some max
		let max = 2048
		let usewidth = this.image.width
		let useheight = this.image.height

		// if it is wide, and it is too wide, then set a fitted target buffer that is max width
		if(usewidth >= useheight && usewidth > max) {
			useheight = useheight * max / usewidth
			usewidth = max
		}

		// if it is tall, and it is too tall, then again set a target buffer that is max height
		if(useheight >= usewidth && useheight > max) {
			usewidth = usewidth * max / useheight
			useheight = max
		}

		// build a target buffer
		this.canvas2 = document.createElement('canvas')
		let tw = this.canvas2.width = usewidth
		let th = this.canvas2.height = useheight
		let ctx2 = this.canvas2.getContext("2d")

		// estimate maximum preserving detail
		let sx = 0
		let sy = 0
		let sw = this.image.width
		let sh = this.image.height
		if(tw/th > sw/sh) {
			let scaledkeep = sh * ( (sw/sh) / (tw/th) )
			sy = (sh - scaledkeep) / 2
			sh = scaledkeep
		} else {
			let scaledkeep = sw * ( (tw/th) / (sw/sh) )
			sx = (sw - scaledkeep) / 2
			sw = scaledkeep
		}

		// paint
		ctx2.drawImage(this.image,sx,sy,sw,sh,0,0,tw,th)

		this.canvas2.toBlob((blob2)=>{this.handleLoad5(blob2)})
	}

	handleLoad5(blob2) {

		this.image2 = {
			kind:ENTITY.IMAGE,
			width:this.canvas2.width,
			height:this.canvas2.height,
			blob:blob2,
			hash: SparkMD5.hash(this.canvas2.toDataURL())
		}

		// print second image - scale to thumbnail wide as per current layout
		this.canvas3 = document.createElement('canvas')
		let tw = this.canvas3.width = 64
		let th = this.canvas3.height = 64
		let ctx3 = this.canvas3.getContext("2d")
		let sx = 0
		let sy = 0
		let sw = this.image.width
		let sh = this.image.height
		if(tw/th > sw/sh) {
			let scaledkeep = sh * ( (sw/sh) / (tw/th) )
			sy = (sh - scaledkeep) / 2
			sh = scaledkeep
		} else {
			let scaledkeep = sw * ( (tw/th) / (sw/sh) )
			sx = (sw - scaledkeep) / 2
			sw = scaledkeep
		}

		ctx3.drawImage(this.image,sx,sy,sw,sh,0,0,tw,th)

		this.canvas3.toBlob((blob3)=>{this.handleLoad6(blob3)})
	}

	handleLoad6(blob3) {

		this.image3 = {
			kind:ENTITY.IMAGE,
			width:this.canvas3.width,
			height:this.canvas3.height,
			blob:blob3,
			hash: SparkMD5.hash(this.canvas3.toDataURL())
		}

		this.handleLoadDone()
	}

	handleLoadDone() {
		this.error(0)
		this.removeimage.onclick()
		this.preview.style.backgroundImage = `url(${this.canvas2.toDataURL()})`
		this.preview.hidden = false
		this.addimage.hidden = true
	}	

	async entityFinalize(entity) {

		// the entity depiction itself may have been set to "" ... which is ok
		// if no file - return success - ie no change
		if(!this.image1 || !this.image2 || !this.image3) {
			return entity
		}

		try {
			let snapshot = 0
			let uid = SugarBase.currentParty ? SugarBase.currentParty.uid : "unknown"

			// first image save
			this.image1.name = `/images/${uid}/image_${this.image1.hash}`
			snapshot = await firebase.storage().ref().child(this.image1.name).put(this.image1.blob)
			if(!snapshot) {
				return this.error("could not save " + this.image1.name)
			}

			// second image save
			this.image2.name = `/images/${uid}/image_${this.image2.hash}`
			snapshot = await firebase.storage().ref().child(this.image2.name).put(this.image2.blob)
			if(!snapshot) {
				return this.error("could not save " + this.image2.name)
			}

			// third image save
			this.image3.name = `/images/${uid}/image_${this.image3.hash}`
			snapshot = await firebase.storage().ref().child(this.image3.name).put(this.image3.blob)
			if(!snapshot) {
				return this.error("could not save " + this.image3.name)
			}

			// don't save these
			delete this.image1.blob
			delete this.image2.blob
			delete this.image3.blob

			entity.image1 = this.image1
			entity.image2 = this.image2
			entity.image3 = this.image3

			entity.depiction = "fs:"+this.image1.name
			entity.filewidth = this.image1.width
			entity.fileheight = this.image1.height
			entity.filehash = this.image1.hash
			return entity

		} catch(error) {
			console.error(error)
			return this.error('ImageSave: Cannot save - unknown reason ' + error)
		}
		return this.error("Failed to save: unknown reason")
	}

}

customElements.define('sugar-image-edit', SugarImageEdit )
