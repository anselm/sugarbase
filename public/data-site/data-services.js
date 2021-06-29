
///
/// a pretend database
/// callers should pass a hash of properties including
///		table -> which table to write to
///		id -> if object exists already
///		transaction -> this is a helper that downstream listeners can use to know what the event was
///

class ServicesDatabase {

	async post(obj) {
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		if(!obj.id) {
			obj.id = this.dbid = this.dbid ? this.dbid + 1 : 1
		}
		this.db[obj.table][obj.id] = obj
		obj.transaction="post"
		await this._broadcast(obj)
		return obj
	}

	/// remove

	async remove(obj) {
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		delete this.db[obj.table][obj.id]
		obj.transaction = "remove"
		await this._broadcast(obj)
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
				job.callback(obj)
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

}

export class Services extends ServicesDatabase {
/*


window.Services = {

	realstate:{},
	observers:{},
	observerid:0,

	/// a custom simple reactivity / observability pattern

	add: function(name) {
		let scope = this
		if(!scope.realstate.hasOwnProperty(name)) {
			Object.defineProperty(scope,name,{
				get: function() {
					let value = scope.realstate[name]
					return value
				},
				set: function(value) {
					console.log("setting " + name + " to " + value)
					scope.realstate[name] = value
					if(!scope.observers[name]) return
					scope.observers[name].forEach( callback => { callback(); })
				}
			})
		}
	},

	set: function(hash) {
		for (const [key, value] of Object.entries(hash)) {
			this.add(key)
			this[key]=value
		}
	},

	observe: function(name,callback) {
		this.observerid++;
		let scope = this
		if(!this.observers[name]) this.observers[name] = []
		let obs = this.observers[name]
		obs[this.observerid] = callback
		return this.observerid
	},

	/// app logic

	login: function() {
		this.set({currentParty:{displayName:"george"}})
	},

	signout: function() {
		this.set({currentParty:0})
	},

}

*/

}

let services = window.Services = new Services()



