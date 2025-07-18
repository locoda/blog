---
title: youtube-dl：一个命令行视频下载利器
pubDate: 2017-07-06
categories: ["软件推荐"]
tags:
- 软件
- 命令行
---

youtube-dl 的官网：http://rg3.github.io/youtube-dl/index.html

youtube-dl 的 GitHub 页面：https://github.com/rg3/youtube-dl（喜欢的话给作者star哦~）

## Youtube-dl 有什么用？

youtube-dl 是一个命令行工具，对我所知的[大部分视频网站](https://github.com/rg3/youtube-dl/tree/master/youtube_dl/extractor)有不错的支持，你可以选择下载视频，或是将视频流直接导出到自己想使用的播放器中，也可以以JSON的形式获取可下载资源的URL。

使用方便、足够简洁，这是我在这里推荐的理由。

## 安装 Youtube-dl

Youtube-dl 通过 PyPi 分发，如果你的系统安装有 `pip3` 或 `pip` ，请直接使用：

```shell
sudo pip install --upgrade youtube_dl # 或pip3
```

如果你是 macOS 用户，也可以使用：

```shell
brew install youtube-dl
```

官网上的[这个页面](http://rg3.github.io/youtube-dl/download.html)还提供了 Windows 可用的 exe 和直接通过 curl 或 wget 安装的方法。

## 利用 Youtube-dl 下载

#### 普通下载

通过 Youtube-dl 下载视频十分简洁，例如你需要下载http://www.bilibili.com/video/av11728123/ 你可以这样：

```shell
youtube-dl 'http://www.bilibili.com/video/av11728123/'
```

你会得到这样的结果：

```
[BiliBili] 11728123: Downloading webpage
[BiliBili] 11728123: Downloading video info page
[download] Destination: 【全明星freestyle】音浪-11728123.mp4
[download] 100% of 9.07MiB in 00:01
```

如果你不进行任何特殊的指定，它会分析网页、自动选择默认画质并下载至`Destination`显示的文件中。

#### 输出文件的名字

如果你想指定输出文件的名字（有时对批量下载的人来说十分重要），你可以使用`-o`：

```shell
youtube-dl 'http://www.bilibili.com/video/av11728123/' -o '你要的名字'
# 下载至文件：你要的名字 (无后缀)
```

当然，请注意你选择的名字的拓展名，youtube-dl 并不会自动修改你所指定的后缀名。youtube-dl 同时也支持 [OUTPUT TEMPLATE](https://github.com/rg3/youtube-dl#output-template)，你可以利用 `%(title)s`等参数（参考 Python 的字符串形式）将文件命名，例如：

```shell
youtube-dl 'http://www.bilibili.com/video/av11728123/' -o '%(title)s.%(ext)s'
# 下载至文件：【全明星freestyle】音浪.mp4
```

#### 使用代理下载

youtube-dl 提供了使用代理的参数，你可以简单地将自己代理的地址填入：

```shell
youtube-dl --proxy 127.0.0.1:1087 'https://www.youtube.com/watch\?v\=_fc_TLg3eQ4'
# 成功通过ss在国内下载某不存在网站的视频
```

如果你不清楚如何使用自己的代理网址，请询问你的代理提供商。

#### 将流文件直接转发到播放器

你可以使用标准输入输出进行这一操作，下面是使用 vlc 播放的方法：

```shell
youtube-dl -o - "https://www.youtube.com/watch\?v\=_fc_TLg3eQ4" | vlc -
```

#### 其他下载选项

youtube-dl 还提供很多其他的下载选项，如挑选合适的分辨率，下载一个播放列表等，你可以研究并自定义如何下载一个文件。

## 国内的 youtube-dl： You-Get

You-Get的GitHub地址：https://github.com/soimort/you-get

事实上而言，我发现You-Get对国内视频网站的支持更加全面，但是由于作者已经有大约两个月的时间没有维护了，我在这里不作推荐。但是如果你遇到无法使用youtube-dl下载的视频页面，不妨试试这个同类小工具。
