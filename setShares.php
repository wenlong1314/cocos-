<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(isset($_REQUEST["game"], $_REQUEST["code"], $_REQUEST["imgDatas"])){
		
		$imgDatas=json_decode($_REQUEST["imgDatas"]);
		foreach($imgDatas as $arr){
			$imgPath="../cdn/share/".$arr[0];
			if(!file_exists($imgPath)){
				$imgBytes=base64_decode($arr[1]);
				file_put_contents($imgPath, $imgBytes);
			}
		}
		file_put_contents("../cdn/".$_REQUEST["game"]."/web/settings.json", urldecode( $_REQUEST["code"]));
		echo "{\"success\":true}";
	}
?>