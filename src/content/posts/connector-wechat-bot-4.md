---
title: 从零开始微信机器人（四）：监控机器人程序
pubDate: 2017-06-26
categories: ["知识课堂"]
tags:
- Python
- 聊天机器人
---

由于使用网页版微信，机器人往往不能够永远地在线。如果无法一直在线，也就失去了自动回复程序的意义。在此，我们使用两种方式来监控机器人程序：

1. 自动定时发送消息
2. 使用supervisor进行监控

# 自动发送消息

## 准备

如果需要定时发送消息，使用`sleep`方式来等待计时会阻塞线程，因此我们会使用`threading`来进行多线程的操作。把一个线程分配给自动给特定人发送微信消息。

## 定义自动发送消息的方法

在进行多线程操作之前，我们先定义一个自动发送消息的方法以备调用：

```python
def send_online_notification(name):
    my_friend = ensure_one(bot.search(name))
    while True:
        my_friend.send('Hello!') # 你想发送的消息
        time.sleep(3600) # 一小时后在进行发送
```

wxpy的`ensure_one()`方法会确认返回的内容仅有一个值，如果返回的列表超过一个值（或是没有返回），它会进行报错。我们在这里寻找`name`相关的好友，并且保证只有一个这样的好友。如果你需要给多个好友发送消息，我建议再使用一个循环来遍历好友列表。

我们写一个阻塞线程的死循环，在死循环中给需要寻找发送特定消息，并让线程停止一小时，由此来打成定时发送消息的方法。

## 增加线程

另一边，我们需要利用多线程调用这个方法。

```python
positiveSendingThread = threading.Thread(target=send_online_notification, args=(u'乙醚。',)) # 请在这里输入你想要寻找的好友昵称或备注
positiveSendingThread.setDaemon(True)
positiveSendingThread.start()
```

这样就成功启用了一个线程来进行自动发送消息了。

# 利用Supervisor监控

## 安装

supervisor是一个python写成的程序，因此可以简单地通过`pip`来进行安装：

```shell
pip install supervisor
```

## 调整 wxpy设置

如果想使用supervisor的重启功能，我们必须开启wxpy的缓存功能以储存登录状态，具体操作在登录时增加`cache_path`参数：

```python
bot = Bot(cache_path=True)
```

你也可以自由选择将缓存存在什么文件中，以免多个机器人冲突

## 配置

官方提供了一个默认的配置文件，你可以使用这条命令输出到你放置机器人的文件夹中：

```shell
echo_supervisord_conf > supervisord.conf
```

在这个`supervisord.conf`后面，我们再追加对微信机器人程序的控制

```shell
[program:bot]
command=python ./wxbot.py              ;执行机器人文件，请修改文件名
process_name=%(program_name)s
autostart=true                   ; 程序是否随supervisor启动而启动
autorestart=true                 ;程序停止时，是否自动重启
startsecs=10
```

## 启动和控制

从命令启动supervisor只需要一句：

```
supervisord -c supervisord.conf
```

`-c`用以指定配置文件，也就是我们刚刚编写的文件。

使用supervisor还可以方便的开始、重启和停止程序：

```shell
supervisorctl start bot # 开始程序，bot 是刚刚填写的程序名
supervisorctl restart bot # 重启程序
supervisorctl stop bot # 停止程序
```

使用supervisor查看自己的程序运行状态

```shell
supervisorctl status # 查看状态
```

因此，只要将wxpy的缓存打开，并且使用supervisor进行自动重启，我们就可以获得一个长时间保持登录的自动回复机器人啦！
