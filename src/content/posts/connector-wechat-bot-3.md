---
title: 从零开始微信机器人（三）：表情机器人的制作
pubDate: 2017-06-25
categories: ["知识课堂"]
tags:
- Python
- 聊天机器人
---

本篇的诞生来自于一朋友制作的表情机器人。当时觉得十分有趣，也希望加入到群聊机器人中，因此就向他讨要了[源代码](https://github.com/qwIvan/microMsg-bot)并制作了表情功能。在此我也再次感谢[吴毅凡](https://github.com/qwIvan)同学的协助！

## 准备工作

由于需要读取网页内容，本文中由于我个人偏好使用xpath来选择网页中元素，使用了[lxml](http://lxml.de/)包，安装的话需要：

```shell
pip install lxml
```

如果你想要使用[BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)来处理网页，请安装：

```shell
pip install beautifulsoup4
```

## 使用斗图啦搜索表情

由于[斗图啦](https://www.doutula.com/)是明文传输数据搜索的，我们可以简单地通过

```python
res = requests.get('https://www.doutula.com/search', {'keyword': keyword})
```

来获取关键词keyword的搜索结果页面。

本例中我使用xpath来选择元素，其具体教程你可以查看[这里](http://www.w3school.com.cn/xpath/index.asp)。如果你想使用`BeautifulSoup`，可以查看[这里](https://github.com/qwIvan/microMsg-bot/blob/master/meme.py#L7)。

```python
html = etree.HTML(res.text)
url = 'http:' + random.choice(html.xpath('//div[@class="image-container"][1]//img[contains(@class, "img-responsive")]/@data-original'))
```

其中`//div[@class="image-container"][1]`选择了页面中的第一个`image-container`元素，如果你观察斗图啦搜索界面，你会发现它分为上下两部分：上面是表情的搜索结果，下半部分则是文章的搜索结果，这样我们就仅挑选了上半部分的表情搜索结果。而`//img[contains(@class, "img-responsive")]/@data-original'`部分则选择了所有`class`里包含`img-responsive`的`img`元素，也就是我们要的图片本身，仔细观察元素本身你会发现图片链接就在其中的`data-original`属性下（但是需要加上http协议）。

Chrome的审查元素功能可以帮助你快速判断自己编写的xpath能否准确选出你想要的元素，也能够查看元素本身。

## 储存图片

因为wxpy自动将gif文件判断作为表情发送，我们可以利用这一点把表情作为表情（而非图片）发送到聊天中。

首先我们使用了临时文件：

```python
from tempfile import NamedTemporaryFile
```

通过request获取图片信息，然后写入到一个临时文件中。

```python
res = requests.get(url, allow_redirects=False)
tmp = NamedTemporaryFile()
tmp.write(res.content)
tmp.flush()
```

## 上传图片并作为表情发送

wxpy提供了上传文件的通道，而上传后的文件就可以免去重新上传直接发送。

```python
media_id = bot.upload_file(tmp.name)
tmp.close()
msg.reply_image('.gif', media_id=media_id)
```

在这里，用我们前文提到的方法，使用`.gif`来进行表情的发送。

如果你想直接发送图片，可以简单地讲`.gif`参数去除：

```python
msg.reply_image('', media_id=media_id)
```

wxpy的作者表示将在之后的版本中更新图片发送的接口以将图片发送和表情发送分开，我相信这一设计会是更加优秀的。
