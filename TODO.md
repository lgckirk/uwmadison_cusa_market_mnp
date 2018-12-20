# TODO
## A. 遗留问题
1. 在页面数据加载完成之前，用loader代替页面
    a) 但在处理image加载的时候可能会比想象的要麻烦一些，需要一个占位图，但微信默认是没有提供在图片记载完毕前使用占位图的功能的...
    如果要实现的话，可以参考[这篇文章](https://www.jianshu.com/p/2ddbdb6c6b6d)
2. 瀑布流抓取数据后，如果决定将新的商品放在哪个column. 本来计划是全部由前端实现，但是发现在image加载完毕前，前端是无法获取到image的dimension的...
    a) 后端给product image table 增加image dimension相关的cols
    b) 更新getProductImage这个借口（除了返回product image 的absolute url, 还需要返回图片的对应dimension）

## B. 新的问题
1. Pagination Problem (Not server error ... it's the front end)
2. php add a new table: (Contact info)
    a) 已经有一个未merge版本 @qsy
    b) 需要将product image 和 contact image upload 到s3的不同目录
3. 发布页面 
    a) 已有一个未merge版本 @lsh
    b) 需要根据是否已上传联系方式，跳转到我的商品页面，指导用户上传自己的二维码
4. utility 需要帮助上传，判断用户是否已经上传用户信息
    a) uploadMyContact: 让用户从album里选择图片，然后利用后端接口上传
    b) checkUserContact: 目前计划无需利用服务器，直接request s3那边存放用户contact image的地址，如果发现"查无此地址" - 那么久说明没上传🤷‍♀️
5. 我的商品页面目前只有一个UI框架 ...
    a) 模仿index.js写关于page页面的更新
    b) 判断用户是否已经上传联系方式，如果没有上传，需要给一个“请上传联系方式的提示”，然后右上角标注一个上传按钮，点击上传用户信息

## C. 寒假计划
1. 搜索
目前没有特别好的想法，大概就是直接对于每条商品的评论和名字加权搜索吧...
2. 在首页加入banner
现在看来，banner对于我们小程序未来的发展还是至关重要的...主要有一下几点:
a) 没有banner会让我们的小程序与小红书一模一样，嗯...一模一样
b) 可以用来跟公众号的小广告一样，拉取赞助
3. 盒饭模块
如果小程序可以用来订盒饭是不是会非常棒呢?不管同学是不是习惯，只是对于每天动辄几百的订单，在小程序里格式化的订购数据绝对要比直接在微信群里面一条一条地发要好太多了吧?
这就要求我们给商家做一个商家端, 另外是否把盒饭功能和二手交易放在一起是有待商议的
如果放在一起，可以说起到互相吸引流量的作用；但是也有可能让小程序变得过于臃肿
