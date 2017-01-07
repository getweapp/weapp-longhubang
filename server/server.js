/*
* 作者：刘焱旺 yw@getweapp.com
* 答疑交流QQ群：499859691
*/

// api服务
const Restify = require('restify')
const Server = Restify.createServer()
Server.use(Restify.queryParser())
Server.use(Restify.bodyParser())

// mongo数据库
const Mongo = require('mongojs')
const Db = Mongo('test', ['employees', 'sales'])
const Employees = Db.employees
const Sales = Db.sales

// 监听端口号
const PORT = 5300

/********** 业务处理开始 **********/

// 获取公司信息
Server.get('/', (req, res) => {
	console.log('GET：/')
	res.send({
		code: 0, 
		data: {
			name: 'GetWeApp销售龙虎榜',
			website: 'https://www.getweapp.com'
		}

	})
})

// 新增员工
Server.post('/employees', (req, res) => {
	const data = req.body
	console.log('POST：/employees, 参数：', data)
	if(!data.no){
		res.send({
			code: 1,
			message: '缺少参数：工号'
		})
		return
	}else if(!data.name){
		res.send({
			code: 1,
			message: '缺少参数：姓名'
		})
		return
	}

	Employees.update({
		no: data.no	
	}, {
		"$set": {
			no: data.no,
			name: data.name
		}
	}, {
		upsert: true
	}, (err, ret) => {
		//console.log('新增员工：', err, ret)
		if(err){
			res.send({
				code: 1,
				message: '服务器故障'
			})
			return
		}
		res.send({
			code: 0,
			data: ret
		})
	})
})

// 获取员工
Server.get('/employees', (req, res) => {
	console.log('GET：/employees')

	Employees.find({}, (err, ret) => {
		console.log('获取员工：', err, ret)
		if(err){
			res.send({
				code: 1,
				message: '服务器故障'
			})
			return
		}
		res.send({
			code: 0,
			data: ret
		})
	})	
})

// 给某个员工增加销售收入
Server.post('/sales', (req, res) => {
	const data = req.body
	console.log('POST：/sales, 参数：', data)
	if(!data.no){
		res.send({
			code: 1,
			message: '缺少参数：工号'
		})
		return
	}else if(!data.month){
		res.send({
			code: 1,
			message: '缺少参数：月份'
		})
		return
	}else if(!data.amount){
		res.send({
			code: 1,
			message: '缺少参数：金额'
		})
		return
	}

	Sales.update({
		no: data.no,
		month: data.month
	},{
		"$set": {
			no: data.no,
			month: data.month
		},
		"$inc": { 
			amount: parseFloat(data.amount)
		}
	},{
		upsert: true
	},(err, ret) => {
		console.log('增加销售收入：', err, ret)
		if(err){
			res.send({
				code: 1,
				message: '服务器故障'
			})
			return
		}
		res.send({
			code: 0,
			data: ret
		})
	})
})

// 统计排名
Server.get('/report', (req, res) => {
	const data = req.query
	console.log('GET：/report, 参数：', data)
	if(!data.month){
		res.send({
			code: 1,
			message: '缺少参数：月份'
		})
		return
	}
	Sales.find({month: data.month}).sort({amount: -1}, (err, ret) => {
		res.send({
			code: 0, 
			data: ret
		})
	})
})

/********** 业务处理结束 **********/

// 监听端口开启api服务
Server.listen(PORT, () => {
	console.log('开启服务器，端口号：', PORT)
})
