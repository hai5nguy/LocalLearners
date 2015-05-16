function MyModule () {
	return {
		ThingOne: new ThingOne(),
		ThingTwo: new ThingTwo()
	}
}

function ThingOne() {
	return {
		one: function () { console.log('one'); }
	}
}

function ThingTwo() {
	return {
		two: function() { console.log('two'); }
	}
}

module.exports = MyModule();