<?php
//header("Access-Control-Allow-Origin: *");
date_default_timezone_set('Asia/Shanghai');
header("Content-Type: text/json; charset=UTF-8");
//var_dump($_REQUEST);
//$_REQUEST = json_encode($_REQUEST);
////echo $_REQUEST["game"];
//echo $_REQUEST["cpbName"];

if (isset($_REQUEST["cpbName"], $_REQUEST["cpb"])) {
	$url =	"../cdn/" . $_REQUEST["game"] . "/web/" . $_REQUEST["cpbName"] ;
//	echo $url;
	if (file_put_contents($url, $_REQUEST["cpb"])) {
		echo "{\"success\":true}";
	} else {
		echo "{\"fail\":fail}";
	};
} else {
	exit();
}
