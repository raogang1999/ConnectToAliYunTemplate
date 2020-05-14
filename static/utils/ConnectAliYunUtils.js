 
var crypto = require("./hex_hmac_sha1.js") 
const deviceConfigs = {
  //三元组，修改为自己的
  productKey: "a1V0WObZHjP",
  deviceName: "wechatApp",
  deviceSecret: "uuQ84A97jASrCAPkycv8QIA8IX7KBNsq",
  regionId: "cn-shanghai"
}

//获取处理后的配置信息
//可以获取到 三元组，url,options
export function getConfigInfo(){
  const options = initMqttOptions(deviceConfigs);
  return {
    deviceConfigs:deviceConfigs,
    url:'wxs://'+deviceConfigs.productKey+'.iot-as-mqtt.'+deviceConfigs.regionId+'.aliyuncs.com',
    options:options
  }
}

//IoT平台mqtt连接参数初始化
function initMqttOptions(deviceConfig) {
  const params = {
    productKey: deviceConfig.productKey,
    deviceName: deviceConfig.deviceName,
    timestamp: Date.now(),
    clientId:20200514,//可以修改
  }
  
  //CONNECT参数
  const options = {
    keepalive: 60, //60s
    clean: true, //cleanSession不保持持久会话
    protocolVersion: 4 //MQTT v3.1.1
  }
  //1.生成clientId，username，password
  options.password = signHmacSha1(params, deviceConfig.deviceSecret);
   
  options.clientId = `${params.clientId}|securemode=2,signmethod=hmacsha1,timestamp=${params.timestamp}|`;
  options.username = `${params.deviceName}&${params.productKey}`;

  return options;
}
/*
  生成基于HmacSha1的password
  参考文档：https://help.aliyun.com/document_detail/73742.html?#h2-url-1
*/
function signHmacSha1(params, deviceSecret) {
  let keys = Object.keys(params).sort();
  // 按字典序排序
  keys = keys.sort();
  const list = [];
  keys.map((key) => {
    list.push(`${key}${params[key]}`);
  });
  const contentStr = list.join('');
  const encode =  crypto.hex_hmac_sha1(deviceSecret,contentStr) 
   
  return encode //createHmac('sha1', deviceSecret)
    // .update(contentStr)
    // .digest('hex');
}
