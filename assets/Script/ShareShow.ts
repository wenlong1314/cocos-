import { _cdn2, get, post, GameCode, CpaData, myCRC32 } from "./global";

import { prefabs } from "./prefabs";
import SharePage from "./SharePage";
import { Share } from "./Settings";

const { ccclass, property } = cc._decorator;
declare let wx: any;
@ccclass
export default class ShareShow extends cc.Component {

    private view: cc.Node;
    private content: cc.Node;
    private currImg: cc.Sprite;
    private imgInput: HTMLInputElement;
    private sharePage: SharePage
    public init(arrs: Array<Share>, sharePage: SharePage, flag?: boolean): void {
        console.log("init ShareShow");
        this.sharePage = sharePage;
        this.view = this.node.getChildByName("view");
        this.content = this.view.getChildByName("content");
        this.content.removeAllChildren();
        this.content.height = (arrs.length) * 160;

        this.initInputHTML();
        //  console.log(arrs);
        for (let index in arrs) {
            let item: cc.Node = prefabs.instantiate("ShareItem");
            // console.log(item);
            let img = item.getChildByName("img").getComponent(cc.Sprite);
            let input1 = item.getChildByName("input1").getComponent(cc.EditBox);
            let input2 = item.getChildByName("input2").getComponent(cc.EditBox);
            let btn = item.getChildByName("btn");
            if (arrs[index].urlBase64) {
                // console.log("新增的数据")
                this.base64ShowImg(arrs[index].urlBase64, arrs[index].imageUrl, img);
            } else if (arrs[index].imageUrl) {
                //console.log("动态加载图片的方法")
                var url = arrs[index].imageUrl;//图片路径
                cc.loader.load(url, function (err, Texture2D) {
                    img.spriteFrame = new cc.SpriteFrame(Texture2D);
                });
            } else {
                //  alert(index + "无图片数据");
            }
            input1.string = arrs[index].query && (arrs[index].query.replace("id=", "") )|| "";
            input2.string = arrs[index].title || "";

            // input1.node.
            input1.node.off('editing-did-ended');
            input2.node.off('editing-did-ended');
            img.node.off(cc.Node.EventType.TOUCH_START);
            btn.off(cc.Node.EventType.TOUCH_START);

            input1.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                input1.string = input1.string.replace(/(^\s*)|(\s*$)/g, "");
                arrs[index].query = "id=" + input1.string;
            });
            input2.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                input2.string = input2.string.replace(/(^\s*)|(\s*$)/g, "");
                arrs[index].title = input2.string;
            });

            item.y = - (Number(index)) * 160;
            this.content.addChild(item);

            img.node.on(cc.Node.EventType.TOUCH_START, () => {
                this.currImg = img;
                if (window["wx"]) {
                    console.log("调取微信接口");
                    wx.chooseImage({
                        success: function (res) {
                            console.log("成功");
                            // 5.2 图片预览
                        },
                        fail: function (res) {
                            console.log("失败");
                        }
                    });
                } else {
                    this.imgInput.click();
                }
            })
            btn.on(cc.Node.EventType.TOUCH_START, () => {
                arrs.splice((Number(index)), 1);
                console.log(arrs);
                this.init(arrs, sharePage);
            })
            // if (flag) {
            //     this.node.getComponent(cc.ScrollView).scrollToBottom(0.1);
            // }
        }
        this.show();
    }


    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public base64Img(urlData, file): void {
        //console.log("准备转换");
        let that = this;
        if (!that.currImg) {
            return;
        }
        let item = this.sharePage.shareArray[that.currImg.node.parent.getSiblingIndex()];
        let Uint8urlData = new Uint8Array(urlData);
        item.urlBase64 = btoa(String.fromCharCode.apply(null, Uint8urlData));
        let name = (100000000 + file.size).toString().substr(1) + (0x100000000 + myCRC32(Uint8urlData)).toString(16).toUpperCase().substr(1) + file.name.match(/(\.\w+)/i)[0];
        item.imageUrl = name;
        this.base64ShowImg(item.urlBase64, name);
    }
    public base64ShowImg(urlBase64, name, item?) {
        //console.log(name);
        let filetype = name.match(/\.(\w+)/i)[1];
        let that = this;
        let strImg = "data:image/" + filetype + ";base64," + urlBase64;
        let img = new Image();
        img.src = strImg;
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.on("load", function a(e) {
            console.log(e)
            if (texture.width <= 600 && texture.height <= 500) {
                if (item) {
                    item.spriteFrame = new cc.SpriteFrame(texture);
                } else {
                    that.currImg.spriteFrame = new cc.SpriteFrame(texture);
                    //这里集合大图

                }
            } else {
                alert("图片宽高不能超过600*500");
            }
            texture.off("load", a);
        });
        texture.handleLoadedTexture();
    }

    public initInputHTML(): void {
        let that = this;
        if (document.getElementById("fileInput")) {
            this.imgInput = document.getElementById("fileInput1") as HTMLInputElement;
        } else {
            this.imgInput = document.createElement("input");
            this.imgInput.type = "file";
            this.imgInput.accept = "*.txt";
            this.imgInput.id = "fileInput1";
            document.body.appendChild(this.imgInput);
            this.imgInput.addEventListener("change", () => {
                var resultFile = this.imgInput.files[0];
                if (resultFile) {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(resultFile);
                    reader.onload = function (e) {
                        console.log("下载成功");
                        that.base64Img(this.result, resultFile);
                        that.imgInput.value = '';
                    };

                }
            })
        }
    }
}
