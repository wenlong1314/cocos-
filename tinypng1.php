<?php
if (!isset($_REQUEST["cpbAtlasName"])) {
	exit();
}
$output_file = "../cdn/cpb/" . $_REQUEST["cpbAtlasName"] . ".png";
$arr = array();
try {
	$im = new imagick($_FILES['cpbAtlas']['tmp_name']); //an image of mine
	$im->setImageFormat('PNG8');
	$colors = min(255, $im->getImageColors());
	$im->quantizeImage($colors, Imagick::COLORSPACE_RGB, 0, false, false);
	$im->setImageDepth(8 /* bits */);
	$im->writeImage($output_file); //将压缩图片写入

	$im2 = new imagick($output_file);
	$imgSize = $im2->getImageSize();

	// 拿压缩图片然后重命名
	$imgdata = file_get_contents($output_file);
	$imgName = crc32($imgdata);
	$imgName2 = substr((string) (100000000 + $imgSize), 1)
		. substr(strtoupper((string) dechex(0x100000000 + $imgName)), 1)
		. ".png";
	file_put_contents("../cdn/cpb/" . $imgName2, $imgdata);

	$arr["success"] = true;
	$arr["name"] =  $imgName2;
	$arr["url"] = "../cdn/cpb/" . $imgName2;
	echo json_encode($arr);
} catch (Exception $e) {
	$arr["fail"] = true;
	echo json_encode($arr);
}
		//	$output_fileUrl = "https://tiny.qimiaosenlin.com/cdn/cpb/" . $_REQUEST["cpbAtlasName"] . ".png";
