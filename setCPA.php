<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(isset($_REQUEST["game"], $_REQUEST["cpaName"], $_REQUEST["cpa"], $_REQUEST["imgDatas"])){
		$name="../cdn/".$_REQUEST["game"]."/web/".$_REQUEST["cpaName"].".json";
		$tmpname="../cdn/".$_REQUEST["game"]."/web/cpa00001.json";
		rename( $name, $tmpname);
		file_put_contents($name, $_REQUEST["cpa"]);
		
		$imgDatas=json_decode($_REQUEST["imgDatas"]);
		foreach($imgDatas as $arr){
			$imgPath="../cdn/cpa/".$arr[0];
			if(!file_exists($imgPath)){
				$imgBytes=base64_decode($arr[1]);
				file_put_contents($imgPath, $imgBytes);
			}
		}
		
		if(isset($_REQUEST["cpbName"],$_REQUEST["cpb"])){
			file_put_contents("../cdn/".$_REQUEST["game"]."/web/".$_REQUEST["cpbName"].".json", $_REQUEST["cpb"]);
		}
		
		if(isset($_REQUEST["cpbAtlasName"],$_REQUEST["cpbAtlas"])){
			file_put_contents("../cdn/cpb/".$_REQUEST["cpbAtlasName"], base64_decode($_REQUEST["cpbAtlas"]));
		}
		if(isset($_REQUEST["company"])){
				// 时间，地址，公司，操作：修改配置文件
				$logFileName="../cdn/Log/log.txt";
				$logCode=date('Y-m-d h:i:s', time())." ".$_REQUEST["company"]." ".$_REQUEST["currIp"].$_REQUEST["game"]."  cpa\n";
				file_put_contents ($logFileName,$logCode,FILE_APPEND);
			}
		echo "{\"success\":true}";
	}
?>