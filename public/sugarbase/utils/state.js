
/// a rudimentary concept of state and observers

export let state = {

	realstate:{},
	observers:{},
	observernames:{},
	observerid:0,

	///
	/// register a field to be watched
	///
	add: function(name) {
		let scope = this
		if(!scope.realstate.hasOwnProperty(name)) {
			Object.defineProperty(scope,name,{
				get: function() {
					let value = scope.realstate[name]
					return value
				},
				set: function(value) {
					scope.realstate[name] = value
					if(!scope.observers[name]) return
					Object.values(scope.observers[name]).forEach( callback => { if(callback)callback(name,value); })
				}
			})
		}
	},

	///
	/// set a bunch fields - triggering observers
	///

	set: function(hash) {
		for (const [key, value] of Object.entries(hash)) {
			this.add(key)
			this[key]=value
		}
	},

	///
	/// Add or remove an observer on a named field
	///

	observe: function(job=0,name=0,callback=0) {
		if(!job) {
			job = ++this.observerid
			this.observernames[job]=name
		} else {
			name = this.observernames[job]
		}
		if(!name || !name.length)return 0 // error
		if(!this.observers[name]) this.observers[name]={}
		let obs = this.observers[name]
		if(!callback) {
			delete obs[job]
			job = 0
		} else {
			obs[job]=callback
		}
		return job
	}

}


