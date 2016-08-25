define('app', ['spa', 'spa_tags', 'spa_route'],
  function(spa, spa_tags, spa_route) {
    return {
      init : function() {
        console.info('require-SPA - \'app\' loading')

        spa_route.init()
        spa_tags.init(spa)

        let options = {
          view: { root: 'views/', extension: '.template.html'},
        }
        let register = {}
        $.extend(true, // should deep copy
            register,
            model.init(spa),
            contents.init(spa),
            menu.init(spa)
        )
        spa_tags.config(register, options)
        spa_tags.cycle(new Date().getTime(), spa.onReady)
      }
    }
});