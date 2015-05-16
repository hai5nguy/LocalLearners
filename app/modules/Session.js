module.exports = function (args) {

    var _this = this;
    _this.args = args;

    _this.foo = function() {
        console.log(_this);
    }
    return _this;
}