define('contents', ['spa_route', 'spa', 'css!styles/contents'], function (spa_route, spa) {
  return {
    init: function () {
      console.info('[controller: contents] loaded')

      spa_route.when('vis',
          function() {
            $('[spa-view=contents] img.route').css('visibility', 'visible')
          },
          function() {
            $('[spa-view=contents] img.route').css('visibility', 'hidden')
          }
      )

      spa.ready(function () {
        $('[spa-view=contents]').addClass('col-md-8 col-md-offset-2').hide()
        $('[spa-view=contents] img.route').one('load', function() {
            $(this).css('visibility', 'hidden')
        }).each(function() {
            $(this).css('visibility', 'hidden')
            let rev = function () {
                if (($('[spa-view=contents] img.route'))[0].complete) {
                  $('[spa-view=contents] img.route').css('visibility', 'hidden')
                  clearInterval(rev_int)
                }
            }
            let rev_int = setInterval(rev, 10)
        })
        $('[spa-view=contents]').show()
      })

    }
  }
});