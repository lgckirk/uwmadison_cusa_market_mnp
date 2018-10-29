const app = getApp();
Component({
  properties: {
      /* Product Type the nav bar is supposed to show. */
      productType: {
          type: Array,
          value: app.globalData.metaProductTypes
      }
  },
  data: { clsid: 0 }, //clsid mark the id for the selected type cell
  methods: {
    changeData:function(e){ this.setData({ clsid: e.currentTarget.id }); }
  }
});