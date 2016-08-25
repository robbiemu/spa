define('spa', function() {
    let spa = {
        ready_functions: [],
        dom_ready_functions: [],
        dom_ready: function (fun) {
            if (document.readyState != 'loading'){
                fun();
            } else {
                this.dom_ready_functions.push(fun)
            }
        },
        onDomReady: function () {
            spa.dom_ready_functions.forEach(function (f) { f() })
        },
        ready: function (fun) {
            spa.ready_functions.push(fun)
        },
        onReady: function () {
            spa.ready_functions.forEach(function (f) { f() })
        }
    }

    document.addEventListener('DOMContentLoaded', spa.onDomReady)

    return spa
})