define('spa', function() {
    let spa = {
        ready_functions: [],
        onDomReady: function () {
            spa.dom_ready_functions.forEach(f => f())
        },
        ready: function (fun) {
            spa.ready_functions.push(fun)
        },
        onReady: function () {
            spa.ready_functions.forEach(f => f())
        }
    }

    return spa
})