<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	//var_dump($_REQUEST);

	if(isset($_REQUEST["game"], $_REQUEST["code"])){
		 
		file_put_contents("../cdn/".$_REQUEST["game"]."/web/settings.json", urldecode( $_REQUEST["code"]));
		if(isset($_REQUEST["company"])){
			// 时间，地址，公司，操作：修改配置文件
			$logFileName="../cdn/".$_REQUEST["game"]."/web/log.txt";
			$logCode=date('Y-m-d h:i:s', time())." ".$_REQUEST["company"]." ".$_REQUEST["currIp"]."  修改setting文件\n";
			
			//$logCode=iconv('GBK',"UTF-8",$logCode);
			mb_convert_encoding($logCode,"GBK","UTF-8");
			file_put_contents ($logFileName,$logCode,FILE_APPEND);
		}
		echo "{\"success\":true}";
		echo "https://tiny.qimiaosenlin.com/cdn/".$_REQUEST["game"]."/web/log.txt";
	}
	
?>