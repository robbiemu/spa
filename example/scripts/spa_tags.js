define('spa_tags', ['spa'], function(spa) {
  spa_tags = {
    init: function () {
      console.info('require-SPA - spa_tags loaded')

      spa.ready(this.ready)

      let des = document.querySelectorAll('[spa-domain]') // let's give the SPA a chance to set up before displaying what may be its views
      Array.prototype.forEach.call(des, function(el, i){
        el.style.display = 'none';
      })
    },
    ready: function () {
      let des = document.querySelectorAll('[spa-domain]') // let's give the SPA a chance to set up before displaying what may be its views
      Array.prototype.forEach.call(des, function(el){ spa_tags.util.fadeIn(el) })
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
      let nes = this.util.parseHTML('<html>' + raw_html + '</html>')
      let additional = false
      Array.prototype.forEach.call(nes, function(el, i) {
        if((!additional) && (el.querySelector('[spa-view],[spa-insert],[spa-repeat]') === null)) {
          additional = true
        }
      })
      if(additional) {
        this.cycle()
      }
    },
    cycle_views: function (tag) {
      this.stack.increment(tag)

      let opts = this.options

      opts.view.root = ((!('root' in opts.view)) || opts.view.root===undefined)? '':opts.view.root
      opts.view.extension = ((!('extension' in opts.view)) || opts.view.extension===undefined)?
          '':opts.view.extension

      let spa_domain_elements = '[spa-domain] [spa-view], [spa-domain][spa-view]'
      let className = 'spa-view-loaded'
      let ses = document.querySelectorAll(spa_domain_elements)
      ses = this.util.AllNotClass(ses, className)

      Array.prototype.forEach.call(ses, function(el, i) {
        let template_url = 'text!' + opts.view.root + el.getAttribute('spa-view') + opts.view.extension
        if(template_url in spa_tags.views) {
          el.innerHTML = spa_tags.views[template_url]
          (el.classList)? el.classList.add(className): el.className += ' ' + className
        } else {
          require([template_url],
              function(template) {
                el.innerHTML = template;
                (el.classList)? el.classList.add(className): el.className += ' ' + className;

                spa_tags.views[template_url] = template

                spa_tags.scan_for_recycle(template, tag)
                spa_tags.stack.decrement(tag)
              })
        }
      })
    },
    cycle_inserts: function (tag) {
      this.stack.increment(tag)

      let spa = this.spa
      Object.keys(spa).forEach(function (k) {
        if('insert' in spa[k]){

        let spa_domain_elements = "[spa-domain] [spa-view=\"" + k + "\"] [spa-insert],\n[spa-domain][spa-view=\"" + k + "\"] [spa-insert],\n[spa-domain] [spa-view=\"" + k + "\"][spa-insert],\n[spa-domain][spa-view=\"" + k + "\"][spa-insert]"
        let className = 'spa-insert-loaded'
        let ses = document.querySelectorAll(spa_domain_elements)
        ses = spa_tags.util.AllNotClass(ses, className)

        Array.prototype.forEach.call(ses, function(el) {
          let i = el.getAttribute('spa-insert')
          if( i in spa[k].insert ) {
            (el.classList)? el.classList.add(className): el.className += ' ' + className
            el.innerHTML = spa[k].insert[i]

            spa_tags.scan_for_recycle(spa[k].insert[i], tag)
            spa_tags.stack.decrement(tag)
          }
        })
      }
    })
    },
    cycle_repeats: function (tag) {
      this.stack.increment(tag)

      let spa = this.spa
      Object.keys(spa).forEach(function (k) {
        if('repeat' in spa[k]) {

        let spa_domain_elements = "[spa-domain] [spa-view=\"" + k + "\"] [spa-repeat],\n[spa-domain][spa-view=\"" + k + "\"] [spa-repeat],\n[spa-domain] [spa-view=\"" + k + "\"][spa-repeat],\n[spa-domain][spa-view=\"" + k + "\"][spa-repeat]"
        let className = 'spa-repeat-loaded'
        let ses = document.querySelectorAll(spa_domain_elements)
        ses = spa_tags.util.AllNotClass(ses, className)

        Array.prototype.forEach.call(ses, function(el, i) {
          let r = el.getAttribute('spa-repeat')
          if( r in spa[k].repeat ) {
            (el.classList)? el.classList.add(className): el.className += ' ' + className

            /* one could change the document itself with this call. scan_for_recycle won't pick that up. a new
             * cycle must be manually called for advanced uses like that */
            el.innerHTML = spa[k].repeat[r](el)

            spa_tags.scan_for_recycle(spa[k].insert[i], tag)
            spa_tags.stack.decrement(tag)
          }
        })
      }
    })
      this.stack.decrement(tag)
    },
    util : {
      fadeIn: function (element) {
        element.style.opacity = '0.1'
        // detect IE8 and above, and edge
        let display = (document.documentMode)? 'block' : ''
        element.style.display = display
        var op = 0.1  // initial opacity
        var timer = setInterval(function () {
          if (op >= 1){
            clearInterval(timer)
            return
          }
          element.style.opacity = ''
          op += 0.2
        }, 10)
      },
      parseHTML: function(str) {
        var tmp = document.implementation.createHTMLDocument('tmp')
        tmp.body.innerHTML = str
        return tmp.body.children
      },
      AllNotClass: function (eles, className) {
        return Array.prototype.filter.call(eles, function(el, i) {
          return (!((el.classList)?
              el.classList.contains(className): new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)))
        })
      }
    }

  }

  return spa_tags
})