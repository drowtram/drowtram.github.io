---
layout:     post
title:      一个关于CoordinatorLayout嵌套滚动的bug
subtitle:   CoordinatorLayout + AppBarLayout + RecyclerView+Header
date:       2018-07-21
author:     Alee
header-img: img/head/code.jpg
catalog: true
tags:
    - bug记录
---

# 一个关于CoordinatorLayout嵌套滚动的bug

> 采用CoordinatorLayout + AppBarLayout + RecyclerView + Header引出的一个bug



## Bug展示

![bug展示](https://ws1.sinaimg.cn/large/a3888eecly1ftu1opf35fg20go0tnkjq.gif) 

## Bug简述

如上图所展示的效果，首页第一次在RecyclerView区域外是响应手动滑动事件的，但是一旦在底部RecyclerView区域有滚动后，再在顶部滑动就死活滑不动的bug，只能在RecyclerView区域往上滑。首页这个布局是完完全全按照[Google的示例代码](https://developer.android.com/reference/android/support/design/widget/AppBarLayout){:target="_blank"}来写的一个嵌套滚动布局，采用的是CoordinatorLayout + AppBarLayout + RecyclerView的形式布局的，然后在RecyclerView里面加入了一个Header[^1]，由于逻辑需要，这个Header在特定条件下才显示出来。



布局代码片段：

```xml
<android.support.design.widget.CoordinatorLayout
      android:layout_width="match_parent"
      android:layout_height="match_parent">

    <android.support.design.widget.AppBarLayout
        android:id="@+id/fm_home_appbar"
        style="?attr/borderlessButtonStyle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@color/color_transparent">

           <android.support.constraint.ConstraintLayout
               android:id="@+id/fm_home_swipe_hide_cl"
               android:layout_width="match_parent"
               android:layout_height="wrap_content"
               app:layout_scrollFlags="scroll">

                  <include layout="xxx"/>
            </android.support.constraint.ConstraintLayout>
    </android.support.design.widget.AppBarLayout>

    <android.support.v7.widget.RecyclerView
        android:id="@+id/fm_home_teacher_rv"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior"/>

</android.support.design.widget.CoordinatorLayout>
```



## Bug解决

回顾这三天来的解决途径：

1. **Google搜索**

   打开Google搜索，我突然之间不知道怎么形容这个bug，犹豫了片刻之后，输入了`coordinator appbar recyclerview 滑动一次就失效` 一番查找后，没有任何帮助，于是乎更换搜索关键词 `coodinator appbar recyclerview scroll site:stackoverflow.com` 翻遍了StackOverFlow也没找到类似的问题。于是决定放弃搜索。

2. **替换布局**

   依照惹不起躲得起的原则决定全部采用RecyclerView来实现，修改布局代码，然后把appbar部分的布局，通过header的方式add到RecyclerView里面，一顿操作后，引出了一个新的问题：因为产品有一个需求是当header滚出屏幕外时，header中的一个子布局需要固定到屏幕顶部还要改变样式，当header重新滚回到屏幕内时，又需要还原header的子布局。要实现这样的逻辑，就得要监听RecyclerView的实时滚动距离，当滚动到header的高度时，做相应的处理。

   逻辑没问题，可是要实现起来发现不是那么简单滴，要监听RecyclerView的实时滚动距离，这其中的坑不少，

   先是通过：

   ```java
   mRecyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
               private int totalDy = 0;
               @Override
               public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                   totalDy -= dy;
               }
           });
   ```

   来监听RecyclerView的滚动距离，正常情况下是没有问题的，但是一旦RecyclerView的数据源变了的时候，比如筛选条件变了，需要清除之前的数据，然后重新添加新的数据到RecyclerView里面去，这时候记录的滚动距离就不准了。

   然后采用`totalDy = recyclerView.computeVerticalScrollOffset();`的方式发现当header从屏幕内滚动到屏幕外时，这个totalDy数值会突然变小，这TM就尴尬了，弃之。

   后面采用自定义RecyclerView的LinearLayoutManager来计算滚动距离，但是在滑动的时候特别消耗性能，滑动卡顿，故只有放弃。

3. **回归嵌套滚动，逐个排查**

   既然RecyclerView走不通，只能回归到最开始的CoordinatorLayout + AppBarLayout + RecyclerView的形式来做了，至少RecyclerView还是能滑动的。但是问题还是需要解决，于是我单独新建了一个Model，然后套用CoordinatorLayout + AppBarLayout + RecyclerView，在代码中给RecyclerView添加适配器后，测试滚动没有问题。既然滚动没有问题，那就意味着这个布局没问题，那就是代码中出了问题，于是把首页的代码逐一的添加到Module中，最后测试到**当给RecyclerView添加header[^1]后，而恰好header的布局又是整个隐藏的，就会出现这个问题**。

   既然找到问题了，那就好说了，因为header被添加后，不能直接隐藏[^2]，那就在代码中把所有header隐藏的部分全部改为header的所有子布局全部隐藏，header不隐藏且header的高度是包裹内容但是必须有一个最低高度。最后折腾了三天的结果是：**在header的父布局中添加`android:minHeight="0.5dp"`即可**。


[^1]: 原生RecyclerView是无法添加header的，本文是通过[BaseRecyclerViewAdapterHelper](https://github.com/CymChad/BaseRecyclerViewAdapterHelper){:target="_blank"}来添加的header
[^2]: 此隐藏包含整个header父布局隐藏或header父布局不隐藏，但是高度是包裹内容且子布局全部隐藏