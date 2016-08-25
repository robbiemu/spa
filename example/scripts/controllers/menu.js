define('menu', ['model', 'css!styles/menu.css', 'css!styles/bootstrap3-glyphicons'],
  function (model) {
    return {
      menu: {
        stackoverflow: {innerText: 'stackoverflow', href: '//stackoverflow.com'},
        github: {innerText: 'github', href: '//github.com'}
      },
      init: function () {
        console.info('[controller: menu] loaded')

        return {
          menu: {
            insert: {brand: model.get('brand')},
            repeat: {'item in menu': this.item_in_menu}
          }
        }
      },
      item_in_menu: function (ele) {
        require(['menu'], function(menu) {
          let m = menu.menu
          $(ele).each(function () {
            let lis = ''
            for (let k in m) {
              lis += '<li class="nav-item"><a class="nav-link" href="' + m[k].href + '">' + m[k].innerText + '</a>'
            }

            $(this).replaceWith(lis)
          })

        })
      }
    }
});