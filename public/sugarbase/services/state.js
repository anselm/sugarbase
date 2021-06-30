
/// a rudimentary concept of state and observers

export default let state = {
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
}


