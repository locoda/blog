---
title: 从零开始微信机器人（一）：wxpy简介
pubDate: 2017-06-23
categories: ["知识课堂"]
tags:
- Python
- 聊天机器人
---

在过去的几个月中，由于在新生群中回答问题费时费力，同时又有许多重复而又有固定答案的回答，我受到一些知乎文章的启发，维护了一个基于itchat的群聊机器人。从刚开始接入图灵机器人时只会尬聊的机器人，之后又加入了api.ai的按照消息内容自动回复，而后再加入了回复表情功能，使得机器人变得越来越有趣。

现在，由于itchat的更新和被wxpy一些更有趣的功能所吸引，我计划将这个机器人分步重写，并将完整的机器人构建步骤展现给大家。这是我第一次做这样的事，有诸多不足之处，也希望多多谅解和指正。

本文很大程度上面向仅对python入门或是了解较少的开发者因此较为详细，希望最大程度上帮助大家从零开始构建一个属于自己的微信机器人，哪怕仅有很少的编程基础。每一篇会将长度控制在较短、能够快速阅读完的范围内。

本文基于python 2.7，与python 3.5可能有语法上区别。

## 安装wxpy

安装wxpy非常简单，如果你拥有pip，请直接按照Github中的方法安装：

> 从 PYPI 官方源下载安装 (在国内可能比较慢或不稳定):

```shell
pip install -U wxpy
```

> 从豆瓣 PYPI 镜像源下载安装 (**推荐国内用户选用**):

```shell
pip install -U wxpy -i "https://pypi.doubanio.com/simple/"
```

## 登录微信

（这里吐槽一下wxpy文档中登录错写为登陆）

Github上和文档中给出了最简单的登录机器人的方式，在程序中写上这两行并运行，会通过图片扫描二维码并登录微信。

```python
# 导入模块
from wxpy import *
# 初始化机器人，扫码登陆
bot = Bot()
```

有些情况下，可能不能通过终端打开图片（例如部署在服务器上时），我们可以通过参数选择在终端内显示二维码，这样代码会变为：

```python
from wxpy import *
bot = Bot(console_qr=True)
```

如果你发现这样设置终端中的二维码变形了，可以尝试传入`console_qr=1`（或其他倍数）来进行调整字幅宽度。如果需要反色显示，可以使用负数来进行反色操作。

如果你认为每次都需要扫描二维码很麻烦，可以启用缓存，来保存自己的登录状态：

```python
bot = Bot(console_qr=True, cache_path=True)
```

## 发送消息

首先我们尝试给自己和文件传输助手发消息：

```python
# 给机器人自己发送消息
bot.self.send('Hello World!')
# 给文件传输助手发送消息
bot.file_helper.send('Hello World!')
```

如果无法给机器人自身发送消息，请参考<http://wxpy.readthedocs.io/zh/latest/bot.html#wxpy.Bot.self>

```python
# 查找昵称为'乙醚。'的好友
my_friend = bot.friends().search(u'乙醚。')[0]
# <Friend: 乙醚。>
```

wxpy同时也包括了发送不同类型消息的方法，通过这些方法我们可以发送各种不同类型的消息。以下是文档给出的样例使用方式：

```python
# 发送文本
my_friend.send('Hello, WeChat!')
# 发送图片
my_friend.send_image('my_picture.png')
# 发送视频
my_friend.send_video('my_video.mov')
# 发送文件
my_friend.send_file('my_file.zip')
# 以动态的方式发送图片
my_friend.send('@img@my_picture.png')
```

通过使用这些方法，我们就可以自定义一个在合适的时候做合适的事情的机器人了！

由于群聊机器人设计暂时需要好友相关内容不多，此处不再作过过多赘述，如果有需要搜索好友的可以参考<http://wxpy.readthedocs.io/zh/latest/chats.html#module-wxpy>

## 自动处理消息

wxpy提供了注册消息的方法，可以简单将各种类型的消息注册并自定义处理方式。

注册消息使用简单的`@bot.register()`方法，

```python
# 获取所有类型的消息（好友消息、群聊、公众号，不包括任何自己发送的消息）
# 并将获得的消息打印到控制台
@bot.register()
def print_others(msg):
    print(msg)
```

同时wxpy也可以给注册消息的类型加上限制，

```python
# 回复 my_friend 发送的消息
@bot.register(my_friend)
def reply_my_friend(msg):
    return 'received: {} ({})'.format(msg.text, msg.type)

# 回复发送给自己的消息，可以使用这个方法来进行测试机器人而不影响到他人
@bot.register(bot.self, except_self=False)
def reply_self(msg):
    return 'received: {} ({})'.format(msg.text, msg.type)

# 打印出所有群聊中@自己的文本消息，并自动回复相同内容
# 这条注册消息是我们构建群聊机器人的基础
@bot.register(Group, TEXT)
def print_group_msg(msg):
 if msg.is_at:
     print(msg)
     msg.reply(meg.text)
```

当然仅仅写以上内容，会导致你的程序主程序运行结束自然退出。wxpy给出了`embed()`方法，在程序末尾（或其他你想要暂停调试的地方）加上`embed()`方法就可以让程序保持运行，同时进入Python命令行。

```python
# 进入 Python 命令行、让程序保持运行
# 推荐使用
embed()

# 或者仅仅堵塞线程
# bot.join()
```

关于消息注册的文档，更多内容可以参考<http://wxpy.readthedocs.io/zh/latest/messages.html#id11>

现在，你已经可以用这个微信机器人和自动回复消息玩了！刺不刺激呢！

下一篇中，我将就如何将API接入机器人进行阐述。

# 你可能会遇到的一些问题

## 报错[SSL: CERTIFICATE_VERIFY_FAILED]

可能的**解决方案**一：

```shell
pip install -U requests[security]
```

可能的**解决方案**二：

进如python后运行：

```python
import certifi
print(certifi.old_where())
```

把打印出的路径（例如我的是`/usr/local/lib/python2.7/site-packages/certifi/weak.pem`）放入环境变量`REQUESTS_CA_BUNDLE`中。具体而言是在*nix环境下运行：

```shell
export REQUESTS_CA_BUNDLE='What you get'
```

或是在Windows中使用系统面板进行修改。
