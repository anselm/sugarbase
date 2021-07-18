
///
/// A pretend database that mimics something like firebase
/// 	Callers typically pass a hash of props including "table" as a hint which table to write in.
/// 	Query by example is supported.
/// 	Observing a query by example is supported; and a field "transaction" is sent on the transaction type.
/// 	Authentication works as well; in a fake way
///

class DB {

	constructor() {
		this.jobcounter = 1
		this.jobs = {}
		this.authenticate = this.authenticate.bind(this) // bind more aggressively...
	}

	volatile(obj) { return obj }

	async post(obj) {
		// shallow clone
		obj = { ... obj}
		// add tables
		if(!this.db) this.db = {}
		if(!this.db[obj.table]) this.db[obj.table] = {}
		// grant id if needed
		if(!obj.id) { obj.id = this.dbid = this.dbid ? this.dbid + 1 : 1 }
		// set created/updated
		let d = new Date()
		if(!obj.hasOwnProperty("created")) obj.created = d.getMilliseconds()
		obj.updated = d.getMilliseconds()
		// write transaction into post
		obj.transaction="post"
		// save
		this.db[obj.table][obj.id] = obj
		// tack on volatile state
		this.volatile(obj)
		// broadcast - TODO wait? does that make sense?
		await this._broadcast(obj)
		// return results
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
		if(!obj.table) throw "must supply table"
		if(!this.db[obj.table]) this.db[obj.table] = {}
		if(obj.id) {
			let candidate = this.db[obj.table][obj.id]
			return candidate ? [candidate] : []
		}
		let results = []
		Object.values(this.db[obj.table]).forEach(result=>{
			if ( Object.keys(obj).every(key => obj[key] === result[key]) ) {
				results.push(result)
			}
		})
		return results
	}

	///
	/// get by id
	///

	async byid(table,id) {
		if(!this.db[table]) this.db[table] = {}
		return this.db[table][id] || 0
	}

	/// tell listeners

	_broadcast(obj) {
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

	async authenticate(args) {
		let fakeuser = await this.post({
			table:"party",
			name:args.name,
			displayName:args.name,
		})
		if(this.callback) this.callback(args)
	}

	async onauth(callback=0) {

		this.callback=callback

		// throw in some helpful data and then pretend we have an auth transition event
		if(!this.latch) {
			this.latch = 1
			let {fakedata} = await import('/sugarbase/fakedb/fakedata.js')
			await fakedata(db)
			callback()
		}
	}

}

export let db = new DB();

