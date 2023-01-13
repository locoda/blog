---
title: '乙醚的小烧杯'
date: 2023-01-13
layout: false
---

<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>乙醚的小烧杯 | 乙醚的博客</title>
    <meta
      name="description"
      content='我的Telegram频道“乙醚的小烧杯”的镜像（非实时更新）'
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="乙醚的小烧杯" />
    <meta property="og:url" content="https://blog.1mether.me/tg-channel.html" />
    <meta property="og:site_name" content="乙醚的博客" />
    <meta
      property="og:description"
      content='我的Telegram频道“乙醚的小烧杯”的镜像（非实时更新）'
    />
    <meta property="og:locale" content="zh_CN" />

  <!-- Import Libraries -->
  <script src="https://unpkg.com/vue@3"></script>
  <script src="https://unpkg.com/tg-blog"></script>
  <link rel="stylesheet" href="https://unpkg.com/tg-blog/dist/style.css">

  <!-- Styles -->
  <style>
      body { font-family: Avenir, Helvetica, Arial, sans-serif }
  </style>
</head>
<body>
  <!-- Template setup (Paste your data url here) -->
  <div id="app">
    <tg-blog posts-url="https://tg.1mether.me/posts.json"></tg-blog>
  </div>

  <!-- Vue js setup -->
  <script>
    Vue.createApp().component("tg-blog", TgBlog.TgBlog).mount('#app')
  </script>
</body>
</html>