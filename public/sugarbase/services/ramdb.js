
///
/// a pretend database
/// callers should pass a hash of properties to post new things
///		table -> which table to write to
///		id -> if object exists already
///		transaction -> this is a helper that downstream listeners can use to know what the event was
///

class DB {

	constructor() {
		this.jobcounter = 1
		this.jobs = {}
	}

	volatiles(obj) {
		// TODO MOVE ME! later have a promotion or volatile concept somewhere else
		if(obj.volatiles) return
		obj.volatile = {}
		obj.volatile.url = "/"+obj.table+"/detail/"+obj.id
	}

	async post(obj) {
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		if(!obj.id) {
			obj.id = this.dbid = this.dbid ? this.dbid + 1 : 1
		}
		this.db[obj.table][obj.id] = obj
		obj.transaction="post"
		this.volatiles(obj)
		this._broadcast(obj)
		return obj
	}

	/// remove

	async remove(obj) {
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		delete this.db[obj.table][obj.id]
		obj.transaction = "remove"
		this._broadcast(obj)
		return 0
	}

	///
	/// a pretend query by example - good enough for demo purposes
	///

	async query(obj) {
			if(!this.db) this.db = {}
			if(!obj.table) throw "must supply table"
			if(!this.db[obj.table]) this.db[obj.table] = {}
			if(obj.id) {
				let candidate = this.db[obj.table][obj.id]
				return candidate ? [candidate] : []
			}
			let candidates = []
			Object.values(this.db[obj.table]).forEach(candidate=>{
				if ( Object.keys(obj).every(key => obj[key] === candidate[key]) ) {
					candidates.push(candidate)
				}
			})
			return candidates
		}

	/// tell listeners

	async _broadcast(obj) {
		if(!this.jobs) return
		Object.values(this.jobs).forEach(job=>{
			if(!job.obj || !job.callback) return
			if ( Object.keys(job.obj).every(key => job.obj[key] === obj[key]) ) {
				job.callback([obj])
			}
		})
	}

	// fresh - a new observer gets all changes
	async freshen(obj,callback) {
		let results = await this.query(obj)
		if(results && results.length) callback(results)
	}

	///
	/// observe or stop observing server side changes on a query by example; returning an array of results
	///

	async observe(job,obj=0,callback=0) {

		if(!obj || !callback) {
			if(job) delete this.jobs[job.id]
			return 0
		}
		if(!job) {
			let id = ++this.jobcounter
			job = { id:id }
			await this.freshen(obj,callback)
		}
		job = this.jobs[job.id] = { id:job.id, obj:obj, callback:callback }
		return job
	}

	/// fake login

	async login(args) {
		let fakeuser = await this.post({
			table:"party",
			name:args.name,
			displayName:args.name,
		})
		console.log("created user")
		console.log(fakeuser)
		this.authchange(fakeuser)
	}

	async signup(args) {
		this.authchange({displayName:args.name})
	}

	async signout() {
		this.authchange(0)
	}

	authchange(args) {
		if(this.callback) this.callback(args)
	}

	onauth(callback=0) {
		this.callback=callback
	}

}

export let db = new DB();

