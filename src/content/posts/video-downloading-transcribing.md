---
title: 关于日剧下载/转写/机翻的工具介绍
pubDate: 2023-03-05
categories: ["软件推荐"]
tags:
- 软件
- 命令行
---

因为2023冬有一部想看的日剧没有字幕组做（在此点名批评富士！！这部剧是[スタンドUPスタート/Stand Up Start](https://www.fujitv.co.jp/stand_up_start/)），所以一边开始自救（指靠生肉和日字机翻度日），一边也在寻找人工智能帮助我更快地看上其他一些追星相关只有日语的物料的方法（一种糊圈人糊圈魂）。春季档已经过了大半，整体的机翻流程已经大体稳定，再想到距离之前写[youtube-dl](https://blog.1mether.me/2017/07/youtube-dl/)的文章已经快六年了，手边使用的工具也有更新，所以记录一下使用的相关工具。想来肯定也没有字幕组用的专业，总之就是一个个人向分享。

提示：并非面向新手的文章，提到的方法有使用门槛（例如命令行基础），有很多可以改进和额外探索的空间

## 下载

近几年下载生肉（特别是日剧生肉）应该不算是难事。现在的日剧基本上每集放送完毕就会上TVer和/或GYAO（可惜GYAO马上就要倒了），有持续一周的免费观看时限。除此之外，通常也会有Hulu、Abema、Amazon Prime、Paravi、FOD等等等等网站的全集配信。再加上有相当多的搬运博主，甚至微博一搜就有付费网站高码率的生肉分享。微博@JP搬运 的置顶有一篇非常不错的[入门文章](https://weibo.com/ttarticle/p/show?id=2309404605753704185952)，如果有兴趣研究的话可以从这里开始（没兴趣研究的话，他这个微博也几乎分享所有生肉，同样也可以在他的置顶找到）。

我自己用来下视频的工具主要是以下两个：

（1）[yt-dlp](https://github.com/yt-dlp/yt-dlp)

支持的网站：TVer、GYAO、FOD等等等等（[完整列表](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)）

它是一个我之前介绍过的youtube-dl的升级版，额外支持了一些网站，并且新增了一些功能。我个人喜欢的一点是它内置了`--geo-bypass-country `这个选项，可以直接绕过TVer、FOD等网站的地域检查（因为是在请求中直接检查的），所以下载起来很方便。

常用命令：`yt-dlp <视频链接> --geo-bypass-country JP -N 16 --write-subs`，其中，`--geo-bypass-country JP `用以绕过日本的地域限制，`-N 16`是使用16个线程下载，`--write-subs`会在视频网站有对应字幕时下载字幕。

（2）[Minyami](https://github.com/Last-Order/Minyami)

支持的网站：Abema、niconico等等等等

提这个的原因是因为众所周知LDH和Abema有一部分合作，虽然扒Abema的档估计其实熟悉的人应该早有办法了，不过还是把这个工具放这儿吧。另外，它还可以用来录直播（Abema和Youtube直播我都试过）。整个工具实现得非常轻巧（赞美）。另外还可以搭配Chrome插件使用，把命令从浏览器直接复制到命令行就能开始下载了，相当便捷。当然，绕过Abema的地域限制能力有限，应该是需要日本IP才能成功下载。

## 字幕

一部分网站是提供字幕的，用yt-dlp就可以下载下来，通常是vtt文件。如果是yt-dlp不支持的网站有软字幕的话（比如KKTV），也可以在网页请求中筛选vtt文件来获得字幕文件，算不上难事，这里也就不再赘述了。

vtt除了在浏览器使用很少会在其他地方见到，如果要转换成其他字幕文件格式的话建议使用[FFmpeg](https://ffmpeg.org/)。这个工具应该有用命令行处理视频的人都不会陌生，非常常用而且万能的视频处理工具了。我用来从转换vtt到srt字幕的命令是`ffmpeg -i sub.vtt -c:s subrip sub.srt`以供参考，其他字幕格式也可以用类似的命令转换。

如果是完全没有字幕的视频或者物料，我会使用OpenAI的[Whisper](https://github.com/openai/whisper)来听写字幕。Whisper去年下半年就已经开源了，有相当多项目利用Whiper进行视频粗剪。我个人的感觉是它的听力比我好（毕竟我确实也不会日语），时间轴的话精度不是特别高，有时候会幻听或有过长的字幕块，但是也是能用的程度，或许不会比熟练工打轴更快，不过应该也算不上是帮倒忙的程度。

常用命令：`whisper <待处理音视频> --model large --language ja -f srt`

有时候出现幻听是因为比较大的背景音，比如说广播或者日剧，本身就有背景音乐，人声不够纯粹。这种情况下我会使用deezer的[Spleeter](https://github.com/deezer/spleeter)来分离人声和背景音获得更好的字幕转写效果。虽然本来应该是用来分离歌曲里歌手声音和背景乐器的，但是我测试的时候发现分离电视剧的对白也是比较准确的，所以现在在进行转写之前基本上都会先分离人声。

常用命令：`spleeter separate -o '.' -d 1200 <待处理音视频>`，其中，`-d`参数设置的是处理多长时间，以秒为单位，默认是10分钟，所以需要额外设置。

Whisper和Spleeter可以在Google Colab上（免费）进行，这样就没有对本地环境的配置要求了。具体代码我放在[Gist](https://gist.github.com/locoda/0b2197b361fea7abf51c5b0a5524705b)上了，有兴趣可以直接另存使用，就不在文章里重新赘述了。

## 翻译

有了日语字幕之后剩下的问题就是怎么翻译成中文了。机翻字幕应该是有相当多解决方案了，这边也是稍微抛砖引玉地提几个我在用或者用过的。

（1）[GT4T](https://gt4t.cn/)

GT4T是我现在用得比较多的翻译器，个人感觉翻字幕是相对准确一些的（特别是人名这一类，不会像DeepL一样给人改名😂），没有仔细研究默认的引擎是哪家。软件支持直接翻译字幕文件，也支持自定义名词这样的功能，使用门槛也不高。

注意：GT4T并不是完全免费的，免费额度用完后是按字符换算收费的。

（2）[SRTranslator](https://github.com/sinedie/SRTranslator)

在GitHub上发现的项目，非常简单粗暴，就是把你输入的srt字幕文件里的文本拿出来，然后打开浏览器放到DeepL里面，把它翻完的输出放回字幕文件里（当然对应DeepL网页版的限制做了些处理）。这个的问题是DeepL这个网页版时不时会[胡言乱语](https://weibo.com/1864422312/MqeVK2owU)，而且DeepL的网页版经常会更新，一更新这个项目就要跟着更新。好处是完全不收钱，而且DeepL大部分时候还算是靠谱（除了人名），白嫖来讲是性价比很高的方式。

（3）[Veed字幕翻译](https://www.veed.io/zh-CN/tools/subtitle-translator)

一个非常简单直观的网页工具，上传字幕文件之后选语言就能获得翻译好的字幕文件，准确度也不错。唯一的问题是我完全没有能理解它是怎么判定免费额度的，有时能翻一整集的字幕文件，有时一下就说超出限制了，总之是一个不错的备用方案。

（4）[Nikse Subtitle Editor](https://www.nikse.dk/subtitleedit/online)

另一个能免费翻译字幕文件的网页工具。如果你想试试谷歌翻译的结果可以用它，但总体而言实在是算不上很准（如果平时有在用谷歌翻译网页的话……谷歌翻译向来就不是很准）。好处是使用直观又不要钱，我也没碰上过用不了的状况，总之实在没啥能用了用它也行吧。

（5）[字幕组机翻小助手](https://tern.1c7.me/#/)

最近发现这个小助手的网页版又能用了，不过因为要弄API有点麻烦也还没有试。目前字幕文件支持ass、srt和vtt，翻译使用百度、DeepL、腾讯云和彩云小译的API，感觉算是比较人性化的使用这些翻译API的方式。

注意：除了网页本身有字数限制之外（可以花钱解除），使用各个公司的API也可能产生收费。

## 其他

之后的事情就是校对和烧录了。虽然说起来简单，但是如果要弄出高质量的字幕显然是校对更花时间一些。这一部分我自己没有什么心得体验（喂），感觉还是靠人工死磕的样子。向轴man致敬……

以上就是本期全部内容啦！希望大家看剧愉快！
