/*
* 作者： 刘焱旺 yw@getweapp.com
* 答疑交流QQ群：499859691
*/

import api from '../../utils/api'
import event from '../../utils/event'
import {format} from '../../utils/util'

Page({
  data:{
   employees: {},
   report: []
  },
  bindInputMonth(e){
  	if(e.detail.value.length == 6){
  		api.get('report', {month: e.detail.value}, (data) => {
  			data.map((e) => {
  				e.amount = format(e.amount)
  			})
  			this.setData({
  				report: data
  			})
  		})
  	}
  },
  updateEmployees() {
	  api.get('employees', {}, (data) => {
  		const employees = {}
  		data.map((e) => { 
  			employees[e.no] = e
  		})
  		this.setData({
  			employees: employees
  		})
  	})
  },
  onLoad() {
  	event.on('report.updateEmployees', this.updateEmployees)
	this.updateEmployees()
  	api.get('', {}, (data) => {
  		wx.setNavigationBarTitle({
		  title: data.name
		})
  	})
  }
})