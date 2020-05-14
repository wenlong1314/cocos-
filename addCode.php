<?php
	//header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(!isset($_REQUEST["game"], $_REQUEST["info"], $_REQUEST["times"])){
		exit();
    }
    
    $conn=new mysqli("127.0.0.1","MonkeyKing","9pqB3y6H4zPYgQWuKOdS",$_REQUEST["game"]);
	//$conn=new mysqli("172.16.4.5","hcrncs","OrPEfKMIkdxXOnBvGKL4","hcrncstxsb111_sword");
    //$conn->query("set names utf8mb4");
	
	for(;;){
		$code=rand(10000000,99999999);
		$result=$conn->query("select f_code from codes where f_code=".$code);
		if($row=$result->fetch_row()){}else{
			break;
		}
	}
	$result=$conn->query("insert into codes (f_code, f_info, f_times) values (".$code.", \"".$_REQUEST["info"]."\", ".$_REQUEST["times"].")");
	
    $conn->close();
	
	echo "{\"success\":true}";
?>