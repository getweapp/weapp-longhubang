/*
* 作者： 刘焱旺 yw@getweapp.com
* 答疑交流QQ群：499859691
*/

import api from '../../utils/api'
import event from '../../utils/event'

Page({
  data: {
    no: '',
    name: ''
  },
  bindInputNo:function(e){
     this.setData({
       no:e.detail.value
     })
  },
  bindInputName:function(e){
     this.setData({
       name:e.detail.value
     })
  },
  save() {
    if(!this.data.no){
      wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: '请输入员工工号',
                    success: (res) => {
                    }
                    })
      return
    }else if(!this.data.name){
      wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: '请输入员工姓名',
                    success: (res) => {
                    }
                    })
      return
    }
    api.post('employees', {
      no: this.data.no,
      name: this.data.name
    }, (data) => {
      this.setData({
        no: '',
        name: ''
      })
      event.exec('report.updateEmployees')
      event.exec('sales.updateEmployees')
      wx.showToast({
  title: '保存员工成功',
  icon: 'success',
  duration: 2000
})
    })
  }
})
