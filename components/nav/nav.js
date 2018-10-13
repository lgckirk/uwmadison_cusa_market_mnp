Component({
  methods: {
    changeData:function(e){
      var currentTypeId = e.currentTarget.dataset.typeid;
      this.setData({
        clsid:currentTypeId
      });
      var typeId = e.currentTarget.dataset.typeid;
      console.log(e);
      //TODO:Change card data on the view
    }
  },
  ready(){
    this.setData({
      clsid: 0
    });
  }
});