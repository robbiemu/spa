define('app', ['menu', 'contents', 'model', 'spa', 'spa_tags', 'spa_route'],
  function(menu, contents, model, spa, spa_tags, spa_route) {
    return {
      init : function() {
        console.info('require-SPA - \'app\' loading')

        spa_route.init()
        spa_tags.init()

        let options = {
          view: { root: 'views/', extension: '.template.html'},
        }
        let register = {}
        $.extend(true, // should deep copy
            register,
            model.init(),
            contents.init(),
            menu.init()
        )
        spa_tags.config(register, options)
        spa_tags.cycle(new Date().getTime(), spa.onReady)
      }
    }
});