<?php
//	header("Access-Control-Allow-Origin: *");
	date_default_timezone_set('Asia/Shanghai');
	header("Content-Type: text/json; charset=UTF-8");
	
	if(!isset($_REQUEST["game"])){
		exit();
    }
	
	$output="";
        
    $conn=new mysqli("127.0.0.1","MonkeyKing","9pqB3y6H4zPYgQWuKOdS",$_REQUEST["game"]);
	//$conn=new mysqli("172.16.4.5","hcrncs","OrPEfKMIkdxXOnBvGKL4","hcrncstxsb111_sword");
    //$conn->query("set names utf8mb4");
	
	$result=$conn->query("select f_code, f_info, f_times from codes order by f_time desc");
	while($row=$result->fetch_row()){
		if (preg_match("/^\\d+$/", $row[0])) {
			$output.=",{\"code\":".$row[0].",\"info\":\"".$row[1]."\",\"times\":".$row[2]."}";
		}
	}
	
    $conn->close();
	
	echo "[".substr($output,1)."]";
?>