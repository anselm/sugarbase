
///
/// a pretend database
/// callers should pass a hash of properties including
///		table -> which table to write to
///		id -> if object exists already
///		transaction -> this is a helper that downstream listeners can use to know what the event was
///

class DB {

	async post(obj) {
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		if(!obj.id) {
			obj.id = this.dbid = this.dbid ? this.dbid + 1 : 1
		}
		this.db[obj.table][obj.id] = obj
		obj.transaction="post"
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
	/// observe changes
	///		- delete the observer by passing a null callback with the job
	/// 	- TODO deliver a rollup on initial listen
	///		- callback must handle arrays or individual items
	///

	async observe(job,obj=0,callback=0) {

		if(!this.jobs) this.jobs = {}
		if(!obj || !callback) {
			if(job) delete this.jobs[job.id]
			return 0
		}
		if(!job) {
			let id = this.jobcounter ? this.jobcounter + 1 : 1
			job = { id:id }
			await this.freshen(obj,callback)
		}
		job = this.jobs[job.id] = { id:job.id, obj:obj, callback:callback }
		return job
	}

	login(user) {
		if(this.callback) this.callback(user)
	}

	signout() {
		if(this.callback) this.callback(0)
	}

	onauth(callback=0) {
		this.callback=callback
	}

}

export let db = new DB();

