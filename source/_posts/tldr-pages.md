---
title: TLDR pages：简易版的 man pages
date: 2017-09-19
category: 软件推荐
tags: 
- 软件
- 命令行
---



# 什么是TLDR？

## TLDR 它本身

tl;dr 是一个网络词汇，和十动然拒这类差不多，是个缩写。它的全称是「Too Long; Don't Read」，翻译成中文的话就叫「太长不看」。它兴起于一些论坛，为了说明「楼主你的破文章又臭又长」，不过后来有许多文章的开头也用

## 这个东西为啥叫太长不看？

一个叫「太长不看」的命令行工具显然是解决一些令程序员一个脑袋两个大的太长的东西，而这个东西就是 **Linux man pages**。它到底有多长呢，man pages的官方压缩包是 2M 多的大小，解压后是 16M。 16M 确实不算大了，然而这 16M 可是纯文本啊。用来做类比的话，一本50万字的中文小说变成纯文本文件之后也就那么 1M 多，可想而知这甚至是全英文 man pages 有多长了。

## 我们却需要它

作为程序员有时又十分需要 man pages。 虽然它长，你又不得不去读它：比如说，你知道 ssh 的基本用法是

```shell
ssh username@remote_host
```

然而当你想换个端口或是利用私钥登入服务器的时候就傻眼了，不得不打开 man pages：

```
SH(1)                    BSD General Commands Manual                   SSH(1)

NAME
     ssh -- OpenSSH SSH client (remote login program)

SYNOPSIS
     ssh [-1246AaCfGgKkMNnqsTtVvXxYy] [-b bind_address] [-c cipher_spec]
         [-D [bind_address:]port] [-E log_file] [-e escape_char]
         [-F configfile] [-I pkcs11] [-i identity_file]
         [-J [user@]host[:port]] [-L address] [-l login_name] [-m mac_spec]
         [-O ctl_cmd] [-o option] [-p port] [-Q query_option] [-R address]
         [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]
         [user@]hostname [command]

DESCRIPTION
```

以下省略一万字……

<!--more-->

于是想找如何使用私钥登录的你感到了一阵绝望……（虽然它确实存在于[-i identity_file]这里，你找到了吗？）

## 所以就有了 TLDR

tldr 很好地解决了这个问题，把 man pages 中最常用的选项用更简单的方式叙述了出来：

```shell
$ tldr ssh

  ssh

  Secure Shell is a protocol used to securely log onto remote systems.
  It can be used for logging or executing commands on a remote server.

  - Connect to a remote server:
    ssh username@remote_host

  - Connect to a remote server with a specific identity (private key):
    ssh -i path/to/key_file username@remote_host

  - Connect to a remote server using a specific port:
    ssh username@remote_host -p 2222

  - Run a command on a remote server:
    ssh remote_host command -with -flags

  - SSH tunneling: Dynamic port forwarding (SOCKS proxy on localhost:9999):
    ssh -D 9999 -C username@remote_host

  - SSH tunneling: Forward a specific port (localhost:9999 to slashdot.org:80):
    ssh -L 9999:slashdot.org:80 username@remote_host

  - Enable the option to forward the authentication information to the remote machine (see man ssh_config for available options):
    ssh -o "ForwardAgent=yes" username@remote_host
```

是的，tldr 的 ssh page 就这么长，而且你几乎还能一下就找到怎么使用私钥登录。虽然它确实非常不全，但是它可以解决你绝大部分想查 man 的问题。

## 而且它是社区驱动的呀！

它是一个开源的项目，每个人都可以为它贡献或修改其中的 page。如果你想去围观这个作品，可以到 [**tldr**](https://github.com/tldr-pages/tldr) 这个 GitHub 代码仓库去做出一些自己的贡献。



# 安装和使用

## 网页版

最简单的使用方法是打开[网页版](https://tldr.ostera.io/)。在上方的搜索框中找到你想查看的命令。例如：

![网页版的 tldr](http://osvlzj5nm.bkt.clouddn.com/17-9-20/91829078.jpg)



## Node.js 版本

TLDR 最初的版本用 Node.js 写成，所以官方最为推荐的安装方法是：

```shell
npm install -g tldr
```

如果你不了解以下一接中提到的任何一种编程语言/包管理器（当然我觉得这种情况也不需要这个破软件就是了），我们也在这里推荐使用 npm 安装。如果你还没有 npm， 可以到[这里](https://www.npmjs.com/get-npm)下载。



## 其他版本

TLDR 的官网也给除了其他一些安装方式：

| Client                                   | Installation instructions                |
| ---------------------------------------- | ---------------------------------------- |
| [Ruby client](https://github.com/YellowApple/tldrb) | `gem install tldrb`                      |
| [Haskell client](https://github.com/psibi/tldr-hs) | `stack install tldr`                     |
| [Python client](https://github.com/lord63/tldr.py) | `pip install tldr.py`                    |
| [C++ client](https://github.com/tldr-pages/tldr-cpp-client) | `brew install tldr`                      |
| [Android client](https://github.com/gianasista/tldr-viewer) | [tldr-viewer on Google Play](https://play.google.com/store/apps/details?id=de.gianasista.tldr_viewer) |
| [iOS client](https://github.com/freesuraj/TLDR) | [TLDR Man Page in App Store](https://appsto.re/sg/IQ0-_.i) |
| [Dash for OSX](https://github.com/Moddus/tldr-python-dash-docset) | open `Preferences > Downloads > User Contributed` and find `tldr pages` in the list |
| [Bash client](https://github.com/pepa65/tldr-bash-client) | `bpkg install pepa65/tldr`               |

##使用方法

简单而言，你只要在命令行输入 `tldr` 加上任何命令即可，例如 `tldr ssh` 或是 `tldr tar`，你就可以获得在第一节中所见的简洁的介绍啦！