(function () {
  try {
    var t = localStorage.getItem('sf_theme')
    if (t !== 'dark' && t !== 'light') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    document.documentElement.dataset.theme = t
    if (t === 'dark') document.documentElement.classList.add('dark')
  } catch (e) {}
})()
