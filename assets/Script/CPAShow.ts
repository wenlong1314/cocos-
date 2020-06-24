import { _cdn2, CpaData, myCRC32, get, getDrewCanvas } from "./global";
import { prefabs } from "./prefabs";
import CPAPage from "./CPAPage";
import CPBAPI from "./CPBAPI";

const { ccclass, property } = cc._decorator;
declare let wx: any;
declare let currIp: string;
@ccclass
export default class CPAShow extends cc.Component {

    private view: cc.Node;
    private content: cc.Node;
    private currImg: cc.Sprite;
    private imgInput: HTMLInputElement;
    private cpaPage: CPAPage;
    private cpbAPI: CPBAPI;
    public init(arrs: Array<CpaData>, cpaPage: CPAPage, flag?: boolean): void {
        console.log("init CPAShow");
        this.cpaPage = cpaPage;
        let that = this;
        this.view = this.node.getChildByName("view");
        this.content = this.view.getChildByName("content");
        this.cpbAPI = new CPBAPI();
        this.content.removeAllChildren();
        this.content.height = (arrs.length - 1) * 160;
        this.initInputHTML();
        console.log(arrs);



        for (let index in arrs) {
            let item: cc.Node = prefabs.instantiate("CPAItem");
            // console.log(item);
            let img = item.getChildByName("img").getComponent(cc.Sprite);
            let input1 = item.getChildByName("input1").getComponent(cc.EditBox);
            let input2 = item.getChildByName("input2").getComponent(cc.EditBox);
            let input3 = item.getChildByName("input3").getComponent(cc.EditBox);
            let checkbox1 = item.getChildByName("checkbox1").getComponent(cc.Toggle);
            let checkbox2 = item.getChildByName("checkbox2").getComponent(cc.Toggle);
            let checkbox3 = item.getChildByName("checkbox3").getComponent(cc.Toggle);
            let checkbox4 = item.getChildByName("checkbox4").getComponent(cc.Toggle);
            let btn = item.getChildByName("btn");
            if (arrs[index].urlBase64) {
                console.log("新增的数据")
                this.base64ShowImg(arrs[index].urlBase64, arrs[index].imgUrl, img);
            } else if (arrs[index].imgUrl) {
                // console.log("动态加载图片的方法")
                var url = "https://cdn-tiny.qimiaosenlin.com/cdn/cpa/" + arrs[index].imgUrl;//图片路径
                // cc.loader
                //动态加载图片的方法

                cc.loader.load(url, function (err, Texture2D) {
                    //  console.log(err)
                    img.spriteFrame = new cc.SpriteFrame(Texture2D);
                    // console.log("Texture2D");
                    //  console.log(Texture2D["_image"]);
                    that.cpbAPI.drewImg(Texture2D["_image"], parseInt(index), Texture2D.width, Texture2D.height);
                });
            } else {
                //  alert(index + "无图片数据");
            }


            input1.string = arrs[index].name || "";
            input2.string = arrs[index].appId || "";
            input3.string = arrs[index].path || "";
            checkbox1.isChecked = arrs[index].cpa1;
            checkbox2.isChecked = arrs[index].cpa2;
            checkbox3.isChecked = arrs[index].hutuiqiang;
            checkbox4.isChecked = arrs[index].IOS;

            input1.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                input1.string = input1.string.replace(/(^\s*)|(\s*$)/g, "");
                arrs[index].name = input1.string;
            });
            input2.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                input2.string = input2.string.replace(/(^\s*)|(\s*$)/g, "");
                arrs[index].appId = input2.string;
            });
            input3.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                input3.string = input3.string.replace(/(^\s*)|(\s*$)/g, "");
                arrs[index].path = input3.string;
            });
            checkbox1.node.on('toggle', () => {
                arrs[index].cpa1 = !arrs[index].cpa1;
            }, this);
            checkbox2.node.on('toggle', () => {
                arrs[index].cpa2 = !arrs[index].cpa2;
            }, this);
            checkbox3.node.on('toggle', () => {
                arrs[index].hutuiqiang = !arrs[index].hutuiqiang;
            }, this);
            checkbox4.node.on('toggle', () => {
                arrs[index].IOS = !arrs[index].IOS;
            }, this);

            item.y = - (Number(index) - 1) * 160;
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
                this.init(arrs, cpaPage);
            })
            if (flag) {
                this.node.getComponent(cc.ScrollView).scrollToBottom(0.1);
            }
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
        console.log("准备转换");
        let that = this;
        let item = this.cpaPage.cpaArray[that.currImg.node.parent.getSiblingIndex() + 1];
        let Uint8urlData = new Uint8Array(urlData);
        item.urlBase64 = btoa(String.fromCharCode.apply(null, Uint8urlData));
        let name = (100000000 + file.size).toString().substr(1) + (0x100000000 + myCRC32(Uint8urlData)).toString(16).toUpperCase().substr(1) + file.name.match(/(\.\w+)/i)[0];
        item.imgUrl = name;
        this.base64ShowImg(item.urlBase64, name);
    }
    public base64ShowImg(urlBase64, name, item?) {
        console.log(name);
        let filetype = name.match(/\.(\w+)/i)[1];
        let that = this;
        let strImg = "data:image/" + filetype + ";base64," + urlBase64;
        let img = new Image();
        img.src = strImg;
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.on("load", function a(e) {
            console.log(e)
            if (texture.width <= 150 && texture.height <= 150) {
                if (item) {
                    item.spriteFrame = new cc.SpriteFrame(texture);
                } else {
                    that.currImg.spriteFrame = new cc.SpriteFrame(texture);
                    let index = that.currImg.node.parent.getSiblingIndex() + 1;
                    that.cpbAPI.drewImg(img, index, texture.width, texture.height, true);
                }
            } else {

                alert("图片宽高不能超过150*150");
            }
            texture.off("load", a);
        });
        texture.handleLoadedTexture();
    }

    public initInputHTML(): void {
        let that = this;
        if (document.getElementById("fileInput")) {
            this.imgInput = document.getElementById("fileInput") as HTMLInputElement;
        } else {
            this.imgInput = document.createElement("input");
            this.imgInput.type = "file";
            this.imgInput.accept = "*.txt";
            this.imgInput.id = "fileInput";
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

