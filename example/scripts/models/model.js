define('model', function() {
    return {
        static: {},
        init: function() {
            console.info('[model: model] loaded')

            this.static.brand = 'requireJS-SPA'
        },
        get: function (what) {
            if(what in this.static) {
                return this.static[what]
            }
        }
    }
})
