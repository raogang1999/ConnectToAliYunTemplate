<script>
	var ConfigInfo = require( "@/static/utils/ConnectAliYunUtils");
	var mqtt = require('./static/utils/alibabacloud-iot-device-sdk-1.2.8-alimin-compatible');
	
	export default {
		data(){
			return {
				reportAndReceiveTopic:"",//自定义的订阅发布topic
			}
		},
		onLaunch: function() {
			var deviceConfigs = ConfigInfo.getConfigInfo().deviceConfigs
			var url = ConfigInfo.getConfigInfo().url
			var options = ConfigInfo.getConfigInfo().options
			var client =  mqtt.mqtt(url,options)
			this.reportAndReceiveTopic = "/"+deviceConfigs.productKey+ "/"+ deviceConfigs.deviceName+"/user/test"
			client.on('connect',()=>{
				  client.subscribe(this.reportAndReceiveTopic,function (err) {
					  if(!err){
						console.log('订阅主题成功');
					  }else
					  {
						 console.error("订阅主题失败\n"+err); 
					  }
				  })
			})
			
			client.on('message',(topic, payload)=>{
				var temp  = JSON.parse(decodeURIComponent(payload))
				console.log(temp)
			})
			
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
