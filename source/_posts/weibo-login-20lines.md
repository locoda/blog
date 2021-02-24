---
title: 猴子都能学会的20行代码登录微博
date: 2017-07-14
category: 计算机课堂
tags: 
- Python
- 爬虫
---

如何登录新浪微博是令许多数据新手（包括我）头疼的大问题。由于新浪的反爬虫策略，网上的教程往往撑不过几个月，查阅到的资料在半年前或是一年前——而它们早就无法使用了，在你想开始爬虫的时候被活生生卡在了第一步。

简单而言，我使用的方法是通过 Selenium 模拟浏览器的行为，直接在浏览器中输入用户名和密码并登录，然后直接从浏览器中获取 Cookies。虽然听起来十分简单（实际上也十分简单），但是确实是十分有效的方式。只要一个网站能通过浏览器登陆，我们就可以简单改造这个程序来登录并获得想要的资料。



# 什么是Selenium？如何使用？

Selenium 是一个项目的名称，都与浏览器和网页测试相关。主要的工具也就是今天我们所要使用的，是WebDriver，是一个浏览器自动化工具。它为很多不同的语言提供了库，包括 Python、Java、Ruby 等。本文中我选择使用 Python 来进行操作，当然你也可以使用你熟悉的语言来进行操作。

在 Python中使用 Selenium 只需要通过`pip`安装 Selenium 提供的 Python 库。

```shell
pip3 install selenium  # 如果你使用 Python 2 ，请使用 pip install selenium
```

仅仅安装 Selenium 本身是不够的，你同时还需要安装 Driver 。你可以将 Driver 理解为浏览器本身的『驱动』，在程序中使用 Driver 就相当于你打开了一个浏览器做了些什么事情。

<!--more-->

在这里我们推荐几个 Driver ：

1. Firefox: https://github.com/mozilla/geckodriver/releases
2. Chrome: https://sites.google.com/a/chromium.org/chromedriver/downloads
3. PhantomJS: http://phantomjs.org/download.html

（如果你是Windows用户，这部分内容也需要参考：http://selenium-python.readthedocs.io/installation.html#detailed-instructions-for-windows-users）

下载后，我建议将可执行文件加入环境中，以备使用。

Firefox 和 Chrome 相信大家都比较熟悉。PhantomJS 是一个可以让你无需浏览器就进行网页相关操作的[WebKit](https://zh.wikipedia.org/wiki/WebKit)，它也没有图形界面。个人比较推荐在调试程序期间使用 Firefox 或是 Chrome ，这样你可以通过观察发现自己哪里出了错。在调试完成后使用 PhantomJS ，来避免多余的可视化渲染。



# 创建一个 WebDriver

利用 Selenium 创建 WebDriver 十分简单粗暴：

```python
from selenium import webdriver
driver = webdriver.Firefox()  # 如果 Firefox 所时使用的 geckodriver 在环境中
# driver = webdriver.PhantomJS()  # 如果你想使用 PhantomJS
```

如果你需要自定义路径，你可以通过传入参数 `executable_path`：

```python
driver = webdriver.Firefox(executable_path="/path/to/geckodriver")
```

如果你使用 Firefox 或 Chrome，你会看到这个操作打开一个浏览器。



# 观察网页本身

为了方便演示，我们使用新浪的移动版进行登录。如果想决定如何操作一个网页，首先我们要观察网页本身。

右键登录的地方并审查元素，你会发现用户名和密码其实是简单的输入框，而登录按钮是一个链接而已。

因此我们简单规划之后要做的事情：

1. 输入用户名和密码
2. 点击登录按钮（或摁回车）



# 利用 Selenium 进行登录操作

## 打开网页

Selenium 提供了方法的`get`方法用以获取网页：

```python
driver.get('https://passport.weibo.cn/signin/login')
```

如果你使用 Firefox 或 Chrome，你会看到这个操作打开微博手机版的登录页面。

## 定位元素

由网页本身的结构我们发现，这两个输入框和登录链接元素的`id`属性都是页面中独一无二的，我们便可以利用这一特点寻找到元素本身。

```python
name_field = driver.find_element_by_id('loginName')  # 用户名输入框
password_field = driver.find_element_by_id('loginPassword')  # 密码输入框
submit_button = driver.find_element_by_id('loginAction')  # 登录键
```

## 输入内容

Selenium 提供了为元素输入的方法 `send_keys()`，直接调用这一方法就可以把内容输入到网页中的输入框内：

```python
name_field.send_keys('你的用户名')
password_field.send_keys('你的密码')
```

如果你使用 Firefox 或 Chrome ，你会看到页面中的两个输入框被填入你在程序中输入的文字。

点击按钮的方法也很简单，如果你已经获取了元素，只要使用`click()`方法：

```python
submit_button.click()  # 单击元素
```

如果你需要使用回车键，可以使用`send_keys()`来发送回车（`Keys.RETURN`），我在这里不展开描述。

如果你担心两个输入框在你输入前就已经有了其他内容而影响操作，你可以使用`clear()`方法，并且我在这里也更加推荐这样的做法：

```python
name_field.clear()  # 清除用户名区域
name_field.send_keys('你的用户名')

password_field.clear()  # 清除密码区域
password_field.send_keys('你的密码')
```

## 获取 Cookies

从 WebDriver 获取 Cookies 只需要一个操作 `get_cookies()`：

```python
driver.get_cookies()
```

它是一个字典文件的列表，每一个字典文件是一个 Cookie。如果你们要在其他 WebDriver 或浏览器中使用这组 Cookies ，使用一个循环来给 WebDriver 利用`add_cookie`方法添加是比较标准的方法：

```python
for cookie in driver.get_cookies():
    another_driver.add_cookie(cookie)
```

## 等待网页载入

如果你仅仅执行上述代码，你会发现如果你的网速不够快，或是电脑不够好，就非常容易在元素出现前就进行操作，然后出现无法找到元素或是元素不可见等错误，我们可以通过等待一段时间来解决这个问题：

```python
import time

# 在获取网页后
time.sleep(2) # 等待2秒
```

这种做法比较简单，但也十分粗暴：因为你无法确定2秒时间足够让网页加载完成。每次打开网页的时间受限于许多因素，你可能很难用一个固定的时间来决定。而 Selenium 本身也提供了一些好用的方法：

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 在获取网页后
WebDriverWait(driver, 20).until(
    EC.presence_of_element_located((By.ID, 'loginName'))) 
# 等待 id 为 loginName的元素出现，最多20秒
```



# 结语

如何登录网站对于收集数据的人而言是个不大不小的问题。通过使用 Selenium，我们几乎可以通过各种方法模拟浏览器的操作，而且这种方法是只要浏览器存在就可以使用的。我相信如何观察网页的结构以及利用是非常有用的技能。

## 完整代码

```python
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.PhantomJS()
driver.get('https://passport.weibo.cn/signin/login')
WebDriverWait(driver, 20).until(
    EC.presence_of_element_located((By.ID, 'loginName')))
time.sleep(1)

name_field = driver.find_element_by_id('loginName')
name_field.clear()
name_field.send_keys('你的用户名')
password_field = driver.find_element_by_id('loginPassword')
password_field.clear()
password_field.send_keys('你的密码')
submit_button = driver.find_element_by_id('loginAction')
submit_button.click()

print(driver.get_cookies())
```

