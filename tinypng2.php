<?php
namespace Yasuo;
class img{
    function getimg(){
        require_once("lib/Tinify/Exception.php");
        require_once("lib/Tinify/ResultMeta.php");
        require_once("lib/Tinify/Result.php");
        require_once("lib/Tinify/Source.php");
        require_once("lib/Tinify/Client.php");
        require_once("lib/Tinify.php");
        //上面引入所需文件.

        \Tinify\setKey("gzq23mwTk0jyHwP0Z5bHBXXXXXXXXXX"); //这里填写你的KEY。没有的可以取申请
        $source = \Tinify\fromFile("https://tinypng.com/images/panda-happy.png"); //这里填写你本地的图片路径。
        $source->toFile("1.png");    //这里填写压缩后需要保持的文件名。
    }
}

$a = new \Yasuo\img; //这里实例化一下。
$a -> getimg();  //这里直接调用压缩的方法。
?>