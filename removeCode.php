<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(!isset($_REQUEST["game"], $_REQUEST["code"])){
		exit();
    }
        
    $conn=new mysqli("127.0.0.1","MonkeyKing","9pqB3y6H4zPYgQWuKOdS",$_REQUEST["game"]);
	//$conn=new mysqli("172.16.4.5","hcrncs","OrPEfKMIkdxXOnBvGKL4","hcrncstxsb111_sword");
    //$conn->query("set names utf8mb4");
	
	$result=$conn->query("delete from codes where f_code=".$_REQUEST["code"]);
	
    $conn->close();
	
	echo "{\"success\":true}";
?>