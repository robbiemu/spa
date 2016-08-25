require.config({
  paths : {
             jquery : '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery',

                spa : 'scripts/spa',
           spa_tags : 'scripts/spa_tags',
          spa_route : 'scripts/spa_route',

                app : 'scripts/app'
  }
})

require(['app', 'jquery'],
  function(app, $, css) {
    app.init()
})
