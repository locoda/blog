---
title: '乙醚的小烧杯'
date: 2023-01-13
# layout: telegram
---

我的Telegram频道[“乙醚的小烧杯”](https://t.me/ethersdaily)的镜像（非实时更新）

{% raw %}
<!-- Import Libraries -->
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/tg-blog"></script>
<link rel="stylesheet" href="https://unpkg.com/tg-blog/dist/style.css">

<!-- Styles & Patches -->
<style>
    #tg-blog-app { font-family: Avenir, Helvetica, Arial, sans-serif }

    /* Fix: Override img max-width: 100% set in layout.styl */
    #tg-blog-app img { max-width: unset; }

    /* Fix: overflow-x: hidden breaks infinite scroll */
    .container { overflow-x: unset !important; }
    body { overflow-x: unset !important; }
</style>

<!-- Template setup (Paste your data url here) -->
<div id="tg-blog-app">
    <tg-blog posts-url="https://tg.1mether.me/posts.json"></tg-blog>
</div>

<!-- Vue js setup -->
<script>
var app = Vue.createApp().component("tg-blog", TgBlog.TgBlog)
app.mount('#tg-blog-app')

// Destroy app when page switched
var interval = setInterval(() => {
    if (!document.getElementById('tg-blog-app')) 
    {
        app.unmount()
        clearInterval(interval)
    }
}, 1000)
</script>
{% endraw %}