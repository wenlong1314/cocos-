<?php
$key=array( "XWAluhvB2Jjljxn1jKgQUFieIPpMCaOO",//2号机
        "mC9JC8GKdPyyncZPL8mCP1UjdUiWGGf9",//3号机
        "GlOl2ZYh5iiZgLedWLgoSYW3yCZ7kD7a",//苹果机
        "9E0RzqlKoDEm6hA2B0VMSDmXejvzSQbp"//358315553
		);
	if(!isset($_REQUEST[0]))	{
		exit();
	}
	// var_dump($_REQUEST);
$data['source'] = ['url'=>$_REQUEST[0]] ;
  
$url='https://api.tinify.com/shrink';

$huawei_res=httpPost($url,$data,$key[rand(0,count($key))]);//返回json
echo $huawei_res;

 function httpPost($url, $data,$key) {
		$curl = curl_init();
		curl_setopt ( $curl, CURLOPT_URL, $url );
		curl_setopt ( $curl, CURLOPT_POST, 1 );
		curl_setopt ( $curl, CURLOPT_HEADER, 0 );
		curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt ( $curl, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt ( $curl, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt ( $curl, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json; charset=utf-8',
			'Authorization: Basic '. base64_encode("api:".$key)
			//. base64_encode("api:".$key)
			)
		);
		$res = curl_exec($curl);
		curl_close($curl);
		return $res;
	}
?>