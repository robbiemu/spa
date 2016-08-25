require.config({
  paths : {
                css : '//cdnjs.cloudflare.com/ajax/libs/require-css/0.1.8/css',
               text : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',

    'bootstrap-css' : '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min',
             jquery : '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery',

                spa : 'scripts/spa',
           spa_tags : 'scripts/spa_tags',
          spa_route : 'scripts/spa_route',

                app : 'scripts/app',
               menu : 'scripts/controllers/menu',
           contents : 'scripts/controllers/contents',
              model : 'scripts/models/model'
  }
});

require(['app', 'jquery', 'css!bootstrap-css'],
  function(app, $) {
    app.init(); // <==== this starts your website build
});
