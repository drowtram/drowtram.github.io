---
layout:     post
title:      解决Android Studio依赖库版本不一致的问题
subtitle:   强制指定第三方依赖库内部所依赖的库的版本号
date:       2018-07-15
author:     Alee
header-img: img/head/gradle.png
catalog: true
tags:
    - gradle
    - 依赖
---



## 具体问题

在项目开发和迭代过程中，我们不得不依赖越来越多的第三方库，有些是为了不重复造轮子，有些是要用别人的功能，比如依赖一些直播平台的库。依赖的库越多，就越容易造成依赖版本冲突的问题。在最近项目上线，空闲下来的时间，准备来解决之前一直没有顾得上解决的一个依赖问题，虽然能编译通过，总感觉有一条红色警告线看着不爽。

就是它...

![](https://ws1.sinaimg.cn/large/a3888eecly1ftjxjqbop3j21q203u77w.jpg)



根据提示，大概意思是说所有com.android.support库所依赖的版本号要一致，多个版本号可能会导致运行崩溃的问题。然后说我的exifinterface库所依赖的版本号是27.1.0，别的support库是用的27.1.1的版本号。



于是我就整个项目翻了个遍，没有发现我们在gradle配置中有依赖这个库，所以这个库应该是我们依赖的某个第三方库内部所依赖的库。但是要找到这个第三方库，却不是那么容易，于是乎google一下有没有别的解决方案。经过折腾，发现了一个可行的方案。



## 解决方案

在项目对应module的gradle中配置如下代码：

```groovy
configurations.all {
    //循环每个依赖库
    resolutionStrategy.eachDependency { DependencyResolveDetails details ->
        //获取当前循环到的依赖库
        def requested = details.requested
        //如果这个依赖库群组的名字是com.android.support
        if (requested.group == 'com.android.support') {
            //且其名字不是以multidex开头的
            if (!requested.name.startsWith("multidex")) {
                //这里指定需要统一的依赖版本 比如我的需要配置成27.1.1
                details.useVersion '27.1.1'
            }
        }
    }
}
```

配置完如下代码以后，再同步一下，就完美解决了提示版本号不一致的问题。当然你也可以通过此方法指定某个第三方库中内部的某个依赖库强制依赖你指定的版本号，例如：

```groovy
...
if (requested.name.startsWith("design")) {
        //这里指定需要的依赖版本
        details.useVersion '27.1.0'
  }
...
```

不过不建议这么干，版本号修改后可能导致第三方库出现不兼容的问题。

另外想说的一点是：我们在自己编写库的时候，建议使用**implementation**来依赖第三方库，这样别人依赖我们的库时，不会依赖到我们内部依赖的第三方库。