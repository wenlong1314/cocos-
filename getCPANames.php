<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(isset($_REQUEST["game"])){
		$dirPath="../cdn/".$_REQUEST["game"]."/web/";
		//echo $dirPath;
		$cpaNames=array();
		$i=-1;
		foreach(glob($dirPath."cpa[0-9]*.json") as $file){
			$cpaNames[++$i]=str_replace($dirPath,"",$file);
		}
		rsort($cpaNames);
		$cpaNames=array_slice($cpaNames,0,1);
		echo json_encode($cpaNames);
	}
?>