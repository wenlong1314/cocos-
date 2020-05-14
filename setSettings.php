<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	//var_dump($_REQUEST);

	if(isset($_REQUEST["game"], $_REQUEST["code"])){
		 
		file_put_contents("../cdn/".$_REQUEST["game"]."/web/settings.json", urldecode( $_REQUEST["code"]));
		echo "{\"success\":true}";
		
	}
	
?>