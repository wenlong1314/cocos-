<?php
$keys = array(
	"XWAluhvB2Jjljxn1jKgQUFieIPpMCaOO", //2号机
	"mC9JC8GKdPyyncZPL8mCP1UjdUiWGGf9", //3号机
	"GlOl2ZYh5iiZgLedWLgoSYW3yCZ7kD7a", //苹果机
	"9E0RzqlKoDEm6hA2B0VMSDmXejvzSQbp" //358315553
);
if (!isset($_REQUEST["cpbAtlas"])) {
	exit();
}

if (strstr($_REQUEST["cpbAtlas"], 'http')) {
	$data['source'] = ['url' => $_REQUEST["cpbAtlas"]];
} else {
	// base64
	//  创建将数据流文件写入我们创建的文件内容中
	//图片放到"https://tiny.qimiaosenlin.com/cdn/cpb/00083160BA5946B6.png

	$output_file = "../cdn/cpb/" . $_REQUEST["cpbAtlasName"] . ".png";
	file_put_contents($output_file, base64_decode($_REQUEST["cpbAtlas"]));
	$output_fileUrl = "https://tiny.qimiaosenlin.com/cdn/cpb/" . $_REQUEST["cpbAtlasName"] . ".png";
	//$output_fileUrl = "https://tinypng.com/images/panda-happy.png";
	$data['source'] = ['url' => $output_fileUrl];
	
}
$url = 'https://api.tinify.com/shrink';
$key=$keys[rand(0, count($keys) - 1)];
$result=httpPost($url, $data, $key);
$huawei_res = json_decode($result); //返回json
if ($huawei_res->output) {
	//	var_dump($huawei_res);
	//	echo "<br />";
	//	echo $huawei_res['output']['url'];这样读取失败
	// 拿值，crc32，命名，存储,返回值
	$imgdata = file_get_contents($huawei_res->output->url);
	$imgName = crc32($imgdata);
	//echo $imgName;
	//echo "<br />";
	$imgName2 = substr((string) (100000000 + $huawei_res->output->size), 1)
		. substr(strtoupper((string) dechex(0x100000000 + $imgName)), 1)
		. "." . substr($huawei_res->output->type, 6);
	// echo	dechex(0x100000000 + $imgName);
	file_put_contents("../cdn/cpb/" . $imgName2, $imgdata);
	//	echo "{\"success\":true}";
	// echo "{\"success\":true,\"name\":" . $imgName2 .
	// 	",\"size1\":" . $huawei_res->input->size .
	// 	",\"size2\":" . $huawei_res->output->size .
	// 	",\"tinyurl\":" . $huawei_res->output->url .
	// 	",\"url\":\"../cdn/cpb/" . $imgName2 . "}";
	$arr = array();
	$arr["success"] = true;
	$arr["name"] =  $imgName2;
	$arr["size1"] = $huawei_res->input->size;
	$arr["size2"] = $huawei_res->output->size;
	$arr["tinyurl"] = $huawei_res->output->url;
	$arr["url"] = "../cdn/cpb/" . $imgName2;
	echo json_encode($arr);
} else {
	//echo $huawei_res;
	echo "{\"fail\":fail,\"key\":".$key."}";
	
}

function httpPost($url, $data, $key)
{
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_HEADER, 0);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt(
		$curl,
		CURLOPT_HTTPHEADER,
		array(
			'Content-Type: application/json; charset=utf-8',
			'Authorization: Basic ' . base64_encode("api:" . $key)
			//. base64_encode("api:".$key)
		)
	);
	$res = curl_exec($curl);
	curl_close($curl);
	return $res;
}
