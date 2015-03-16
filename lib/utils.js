module.exports = {
    // Adds a self property in the context where the function 'fn' will be called
    addSelf: function (fn, self) {
        return function () {
            this.self = self;
            fn.apply(this, arguments);
        }
    },

    reAllMatches: function (regex, string) {
        var result = [];

        do {
            var match = regex.exec(string);
            if (match)
                result.push(match[0]);
        } while (match);

        return result;
    }
};
