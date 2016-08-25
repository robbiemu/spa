define('spa_tags', ['jquery', 'spa'], function($, spa) {
  return {
    init: function () {
      console.info('require-SPA - spa_tags loaded')

      spa.ready(this.ready)

      $('[spa-domain]').hide() // let's give the SPA a chance to set up before displaying what may be its views
    },
    ready: function () {
      $('[spa-domain]').fadeIn()
    },
    config: function (register, options) {
      this.spa = register
      this.options = options
    },
    cycle: function(tag, cb) {
      if(typeof cb === 'function') {
        this.stack.callback(tag, cb)
      }

      if('view' in this.options) {
        this.cycle_views(tag)
      }

      this.cycle_inserts(tag)
      this.cycle_repeats(tag)

    },
    stack: {
      cycles: {},
      cycle_callbacks: {},
      callback: function (tag, cb) {
        this.cycle_callbacks[tag] = cb
        this.cycles[tag] = 0
      },
      increment: function (tag) {
        if(tag in this.cycles) {
          this.cycles[tag]++
        }
      },
      decrement: function (tag) {
        if(tag in this.cycles){
          --(this.cycles[tag])
          if ((this.cycles[tag] === 0) && (tag in this.cycle_callbacks)) {
            this.cycle_callbacks[tag]()
          }
        }
      }
    },
    views: {},
    scan_for_recycle: function (raw_html) {
      if($( $.parseHTML('<html>' + raw_html + '</html>') ).find('[spa-view],[spa-insert],[spa-repeat]').length > 0) {
        this.cycle()
      }
    },
    cycle_views: function (tag) {
      this.stack.increment(tag)

      let spa_tags = this
      let opts = this.options

      opts.view.root = ((!('root' in opts.view)) || opts.view.root===undefined)? '':opts.view.root
      opts.view.extension = ((!('extension' in opts.view)) || opts.view.extension===undefined)?
          '':opts.view.extension

      $('[spa-domain] [spa-view], [spa-domain][spa-view]').not('.spa-view-loaded').each(function () {
        let view = this
        let template_url = 'text!' + opts.view.root + $(this).attr('spa-view') + opts.view.extension
        if(template_url in spa_tags.views) {
          $(view).html(spa_tags.views[template_url]).addClass('spa-view-loaded')
        } else {
          require([template_url],
            function(template) {
              $(view).html(template).addClass('spa-view-loaded')
              spa_tags.views[template_url] = template
              spa_tags.scan_for_recycle(template, tag)

              spa_tags.stack.decrement(tag)
            })
        }
      })
    },
    cycle_inserts: function (tag) {
      this.stack.increment(tag)

      let spa_tags = this
      let spa = this.spa
      Object.keys(spa).forEach((k) => {
        if('insert' in spa[k]){
          $(`[spa-domain] [spa-view="${k}"] [spa-insert],
[spa-domain][spa-view="${k}"] [spa-insert],
[spa-domain] [spa-view="${k}"][spa-insert],
[spa-domain][spa-view="${k}"][spa-insert]`).not('.spa-insert-loaded').each(function () {

            let i = $(this).attr('spa-insert')
            if( i in spa[k].insert ) {
              $(this).addClass('spa-insert-loaded').html(spa[k].insert[i])
              spa_tags.scan_for_recycle(spa[k].insert[i], tag)
              spa_tags.stack.decrement(tag)
            }
          })
        }
      })
    },
    /* you'd have to manually run a cycle again if repeat added spa-attrs anywhere */
    cycle_repeats: function (tag) {
      this.stack.increment(tag)

      let spa = this.spa
      Object.keys(spa).forEach((k) => {
        if('repeat' in spa[k]) {
          $(`[spa-domain] [spa-view="${k}"] [spa-repeat],
[spa-domain][spa-view="${k}"] [spa-repeat],
[spa-domain] [spa-view="${k}"][spa-repeat],
[spa-domain][spa-view="${k}"][spa-repeat]`).not('.spa-repeat-loaded').each(function () {

            let r = $(this).attr('spa-repeat')
            if( r in spa[k].repeat ) {
              let template = spa[k].repeat[r](this)
              $(this).addClass('spa-repeat-loaded').html(template)
            }
          })
        }
      })
      this.stack.decrement(tag)
    }
  }
})