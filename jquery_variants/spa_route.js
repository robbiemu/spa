define('spa_route', function () {
  return {
    routes: {},
    when: function (hash, callback, destroy) {
      this.routes[hash] = {callback:callback, destroy:destroy}
    },
    current_destroy: function(){},
    init: function () {
      console.info('require-SPA - spa_route loaded')

      route = this
      $(function() {
        window.addEventListener('hashchange', function(e) {
          let anchor = document.location.hash.substring(1)
          console.info(`[route] route changed to '${anchor}'`)

          if(typeof route.current_destroy === 'function') {
            route.current_destroy()
          }
          if (anchor in route.routes) {
            route.routes[anchor].callback()
            route.current_destroy = route.routes[anchor].destroy
          }
        })
      })
    }
  }
})
