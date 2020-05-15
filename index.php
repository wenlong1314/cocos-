<?php
	require_once "../common/jssdk.php";
	$sys=new SYS(
		"https://tiny.qimiaosenlin.com/5b7248e6372375b7248edb0de65b7248f69c5495b7248fe718m5d5b72490319047/",
		"GMCocos","GMCocosGMCocosGMCocosGMCocos"
	);
	$sys->cacheVersion=5;
	
	$sys->isDD=false;
	$sys->isTB=false;
	$sys->isWX=false;
	$testing=true;
	
	$webPath="https://cdn-tiny.qimiaosenlin.com/cdn/5b7248e6372375b7248edb0de65b7248f69c5495b7248fe718m5d5b72490319047/web/";
	//$webPath="https://cdn-tiny.qimiaosenlin.com/cdn/5b7248e6372375b7248edb0de65b7248f69c5495b7248fe718m5d5b72490319047/web/";
	$wxImgUrl=$webPath."resource/00007160F1D2E72B.jpg";
	
	//$openId="fake";
	//$nickname="上山打老虎";
	//$headImgURL="https://wx.qlogo.cn/mmopen/Q3auHgzwzM7aVD0EhvW6D8e8THk1jmam3WIk8M6LgZdS6ibTDEFVXEiax1eMyGxyxFj7oibCOZZQ1bNuc9DnbADXQ/0";
	
	$openId="";
	$nickname="";
	$headImgURL="";
	
	if($sys->isDD){
		//
	}else if($sys->isTB){
		require_once "../taobaosdk/TopSdk.php";
		$sys->dirURL="https://htests.ews.m.jaeapp.com/dahaitu/";
		$jssdk=new AliJSSDK(__FILE__);
	}else if($sys->isWX){
		$jssdk=new JSSDK(__FILE__, $sys->dirURL);
		if(isset($_REQUEST["code"])){
			$openId=$jssdk->getOpenId($_REQUEST["code"]);
			if($openId){
				$userInfo=$jssdk->getUserInfo($openId);
				if(isset($userInfo->nickname)){
					if($userInfo->nickname){
						$nickname=$userInfo->nickname;
						if(isset($userInfo->headimgurl)){
							if($userInfo->headimgurl){
								$headImgURL=$userInfo->headimgurl;
							}
						}
					}
				}
			}else{
				$jssdk->getCodeHeader($sys->dirURL, "snsapi_userinfo");
				exit();
			}
		}else{
			$jssdk->getCodeHeader($sys->dirURL, "snsapi_userinfo");
			exit();
		}
	}
	
?><!DOCTYPE HTML>
<html>

<head>
	<meta charset="utf-8">
<?php if($sys->isTB){ ?>
	<meta id="WV.Meta.Share.Title" value="<?php echo $sys->title ?>" />
	<meta id="WV.Meta.Share.Text" value="<?php echo $sys->desc ?>" />
	<meta id="WV.Meta.Share.Image" value="<?php echo $wxImgUrl ?>" />
	<meta name="spm-id" content="a1z51.24862166" />
<?php } ?>
	<meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="full-screen" content="true" />
	<meta name="screen-orientation" content="portrait" />
	<meta name="x5-fullscreen" content="true" />
	<meta name="360-fullscreen" content="true" />
	<title><?php echo $sys->title ?></title>
	<style>
		html, body {
			-ms-touch-action: none;
			background: #000000;
			padding: 0;
			border: 0;
			margin: 0;
			height: 100%;
		}
	</style>
	<!--script src="https://cdn-tiny.qimiaosenlin.com/cdn/common/vconsole.min.js"></script>
	<script>
		// 初始化vConsole
		window.vConsole = new window.VConsole({
		  defaultPlugins: ["system", "network", "element", "storage"], // 可以在此设定要默认加载的面板
		  maxLogNumber: 1000,
		  onReady: function() {
			// console.log("vConsole is ready.");
		  },
		  onClearLog: function() {
			// console.log("on clearLog");
		  }
		});
	</script-->
	<script>
		var _hmt = _hmt || [];
		(function() {
		  var hm = document.createElement("script");
		  hm.src = "https://hm.baidu.com/hm.js?21fb2b552a458021c4ce59e6f6fea12e";
		  var s = document.getElementsByTagName("script")[0]; 
		  s.parentNode.insertBefore(hm, s);
		})();
	</script>
<?php if($testing || $sys->isDD || $sys->isTB || $sys->isWX){ ?>
	<script>
		var platformType = "调试";
		var cacheVersion = <?php echo $sys->cacheVersion ?>;
		var useZip = true;
		var testing = true;
		var useCDN = true;
		var webPath = "<?php echo $webPath ?>";
		var isWX = false;
		var isDD = false;
		var isTB = false;
		var wxIsReady = false;
		var wxTitle = "<?php echo $sys->title ?>";
		var wxDesc = "<?php echo $sys->desc ?>";
		var wxLink = "<?php echo $sys->dirURL ?>";
		var wxImgUrl = "<?php echo $wxImgUrl ?>";
		var company = "<?php echo isset($_REQUEST["company"])?$_REQUEST["company"]:"" ?>";
	</script>
<?php } ?>
<?php if($sys->isDD){ ?>
	<script src="//g.alicdn.com/dingding/open-develop/1.9.0/dingtalk.js"></script>
	<script>
		isDD=true;
		dd.ready(function(){
			dd.biz.navigation.setRight({
				show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
				control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
				showIcon: true,//是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
				text: "分享",//控制显示文本，空字符串表示显示默认文本
				onSuccess: function (result) {
					/* {} */
					//如果control为true，则onSuccess将在发生按钮点击事件被回调
					dd.biz.util.share({
						type: 0,//分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
						url: wxLink,
						title: wxTitle,
						content: wxDesc,
						image: wxImgUrl,
						onSuccess : function() {
						},
						onFail : function(err) {
							alert(err);
						}
					});
				},
				onFail: function (err) {
					alert(err);
				}
			});
		});
	</script>
<?php } else if($sys->isTB){ ?>
	<script src="//g.alicdn.com/tmapp/tida/3.3.1/tida.js?appkey=24862166"></script>
	<script>
		isTB=true;
	</script>
<?php } else if($sys->isWX){
		$signPackage = $jssdk->getSignPackage("jsapi");
?>
	<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<script>
		isWX=true;
		wx.config({
			debug: false,
			appId: "<?php echo $signPackage["appId"] ?>",
			timestamp: <?php echo $signPackage["timestamp"] ?>,
			nonceStr: "<?php echo $signPackage["nonceStr"] ?>",
			signature: "<?php echo $signPackage["signature"] ?>",
			jsApiList: [
				"onMenuShareTimeline",
				"onMenuShareAppMessage"
			]
		});
		wx.ready(function(){
			wxIsReady=true;
			setShare(wxTitle, wxImgUrl);
		});
		function setShare(wxTitle, wxImgUrl){
			console.log("setShare wxTitle="+wxTitle+", wxImgUrl="+wxImgUrl);
			wx.onMenuShareTimeline({
				title: wxTitle,
				link: wxLink,
				imgUrl: wxImgUrl,
				trigger: function(res) {
					//alert("用户点击分享到朋友圈");
				},
				success: function(res) {
					//console.log(JSON.stringify(res));
				},
				cancel: function(res) {
					//alert("已取消");
				},
				fail: function(res) {
					alert(res.errMsg);
				}
			});
			wx.onMenuShareAppMessage({
				title: wxTitle,
				desc: wxDesc,
				link: wxLink,
				imgUrl: wxImgUrl,
				type: "",
				dataUrl: "",
				trigger: function(res) {
					//alert("用户点击发送给朋友");
				},
				success: function(res) {
					//console.log(JSON.stringify(res));
				},
				cancel: function(res) {
					//alert("已取消");  
				},
				fail: function(res) {
					alert(res.errMsg);
				}
			});
		}
	</script>
<?php } ?>
</head>
<body>
<?php if($testing || $sys->isDD || $sys->isTB || $sys->isWX){ ?>
	<script src="https://cdn-tiny.qimiaosenlin.com/cdn/common/jquery-1.11.2.min.js"></script>
	<canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
	<script src="<?php echo $webPath ?>src/settings.js" charset="utf-8"></script>
	<script src="<?php echo $webPath ?>main.js" charset="utf-8"></script>
	<script type="text/javascript">
	(function () {

		function loadScript (moduleName, cb) {
			function scriptLoaded () {
				document.body.removeChild(domScript);
				domScript.removeEventListener("load", scriptLoaded, false);
				cb && cb();
			};
			var domScript = document.createElement("script");
			domScript.async = true;
			domScript.src = moduleName;
			domScript.addEventListener("load", scriptLoaded, false);
			document.body.appendChild(domScript);
		}

		loadScript(webPath + "cocos2d-js-min.js", function () {
			window.boot();
		});
	})();
	</script>
<?php } else { ?>
	<div style="width:100%;height:600px;display:flex;flex-direction:column;justify-content:center;">
		<img src="https://cdn-tiny.qimiaosenlin.com/cdn/5b7248e6372375b7248edb0de65b7248f69c5495b7248fe718m5d5b72490319047/web/resource/000098024E462D14.png" style="display:flex;align-self:center;"/>
		<font style="font-size:32px;display:flex;align-self:center;">请用微信扫描欣赏</font>
	</div>
<?php } ?>
</body>
</html>