/*
* 作者： 刘焱旺 yw@getweapp.com
* 答疑交流QQ群：499859691
*/

import api from '../../utils/api'
import event from '../../utils/event'

Page({
  data: {
    index: 0,
    pickers: [],
    employees: [],
    no: '',
    month: '',
    amount: ''
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      no: this.data.employees[e.detail.value].no
    })
  },
  bindInputMonth(e){
     this.setData({
       month:e.detail.value
     })
  },
  bindInputAmount(e){
     this.setData({
       amount:e.detail.value
     })
  },
  save() {
    if(!this.data.month){
      wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: '请输入销售月份',
                    success: (res) => {
                    }
                    })
      return
    }else if(!this.data.amount){
      wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: '请输入销售金额',
                    success: (res) => {
                    }
                    })
      return
    }

    api.post('sales', {
      no: this.data.no,
      month: this.data.month,
      amount: this.data.amount
    }, (data) => {
      this.setData({
        amount: ''
      })
       wx.showToast({
  title: '新增销售成功',
  icon: 'success',
  duration: 2000
})
    })
  },
  updateEmployees() {
     api.get('employees', {}, (data) => {
      const pickers = []
      data.map((e) => {
        pickers.push(e.no+' '+e.name)
      })
      this.setData({
        employees: data,
        pickers: pickers,
        no: (data.length)?data[0].no:''
      })
      console.log(data)
    })
  },
  onLoad() {
    event.on('sales.updateEmployees', this.updateEmployees)
   this.updateEmployees()
  }
})