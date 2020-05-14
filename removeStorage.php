<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(!isset($_REQUEST["game"], $_REQUEST["openId"])){
		exit();
    }
        
    $conn=new mysqli("127.0.0.1","MonkeyKing","9pqB3y6H4zPYgQWuKOdS",$_REQUEST["game"]);
	//$conn=new mysqli("172.16.4.5","hcrncs","OrPEfKMIkdxXOnBvGKL4","hcrncstxsb111_sword");
    //$conn->query("set names utf8mb4");
	
	$openId=$_REQUEST["openId"];
	
	$output="";
	
	$result=$conn->query("select count(*) from oim where f_openid=\"".$openId."\"");
    list($count)=$result->fetch_row();
	$output.="删除 oim 表 $count 条记录；";
	$conn->query("delete from oim where f_openid=\"".$openId."\"");
	
	$result=$conn->query("select count(*) from users_v2 where f_openid=\"".$openId."\"");
    list($count)=$result->fetch_row();
	$output.="删除 users_v2 表 $count 条记录";
    $conn->query("delete from users_v2 where f_openid=\"".$openId."\"");
	
	echo "{\"success\":true,\"message\":\"".$output."\"}";
	
?>