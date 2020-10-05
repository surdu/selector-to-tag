// String extensions

if (!String.prototype.insertAt) {
	String.prototype.insertAt = function (index, string) {
		return this.substr(0, index) + string + this.substr(index);
	};
}

// RegExp extensions

if (!RegExp.prototype.getAllMatches) {
	RegExp.prototype.getAllMatches = function (string) {
		var result = [];
		var match;
		do {
			match = this.exec(string);
			if (match) {
				result.push(match[0]);
			}
		} while (match);

		return result;
	};
}

module.exports = {};
