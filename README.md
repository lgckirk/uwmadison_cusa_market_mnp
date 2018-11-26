# TODO
## A. 第一次进入我的商品, post商品：提示录入联系信息
1. 需要做成一个录入信息的component
2. myProduct, postProduct 根据是否已经录入信息，选择性render 这个component和主页面
        a) 需要一个global state variable 显示是否已经录入信息
        b) 上传成功后， 跟新global state variable
        c) 使用的时候，需要传入一个完成使用的callback,用以重新render页面
3. login 的时候，需要判断图片有没有被初始化，用这个set global variable, 用此global variable 来做各类相关页面渲染方式的判断    
## B. myProduct: 
1. 增加页面Event Handler:
        a) onRefresh
        b) onReachBottom
2. ~~在util里加入getProductByUser~~
## C. waterfall 
1.  根据column长度，动态分配新加入的product该放在哪个column
## D. productDetail
1.  加入page parameter, 通过wx.navigatoTo时传入的page parameter来传入商品id
2. 根据商品id向服务器请求商品数据，在数据加载完毕前，用loader代替page
3. 也许需要与后端协调，增加getContactOfOwner的接口

## E. 不同页面在UserId尚未加载成功前的表现:
1. myProduct: 如果发现ID尚未加载成功，则先在页面内显示loader, 然后主动发出query请求UserID(同一用户多次加载ID并不会出现问题), 等待加载完毕后, 利用ID请求myProduct, 然后刷新页面。期间无需禁止用户在不同tab之间的切换
2. postProduct: 关于UserID的检查发生在发布商品的时候，在用户选择发布商品后，需要在页面中央显示loader, 然后隐藏底部switchTab, 禁止页面内一切点击事件

## F. Server请求期间注意事项
所有页面，在初始化时，如果有对server的数据请求，在数据加载完毕前，使用loader代替页面内容

