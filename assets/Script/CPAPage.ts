import { _cdn2, get, post, CpaData, getDrewCanvas } from "./global";
import { main } from "./Main";
import CPAShow from "./CPAShow";

const { ccclass, property } = cc._decorator;

// https://cdn-tiny.qimiaosenlin.com/cdn/cpa/00013193CEC37D18.png
@ccclass
export default class CPAPage extends cc.Component {
    private submit: cc.Node;
    public btn: cc.Node;
    private cpaShow: CPAShow;
    public time: cc.Node;
    public cpaPage: CPAPage;
    //  public cpaArray: { [key: string]: CpaData };
    public cpaArray: Array<CpaData>;
    public cpaName: string;
    public imgDatas: Array<Array<string>> = [];
    public reqCpaData: any;
    public cpbNames: Array<string>;
    public init(): void {
        console.log("init CPAPage");
        this.cpaPage = this;
        this.submit = this.node.getChildByName("submit");
        this.btn = this.node.getChildByName("btn");
        this.time = this.node.getChildByName("time");
        this.cpaShow = this.node.getChildByName("cpaShow").getComponent(CPAShow);

        this.time.getComponent(cc.Label).string = "刷新于：" + new Date().toLocaleString();
        this.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {

            console.log(this.cpaArray);
            let item: CpaData = {};
            this.cpaArray.push(item);
            this.cpaShow.init(this.cpaArray, this.cpaPage, true);
        });
        this.submit.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            console.log("上传");
            //1 判断是否有未填项
            //2 整理上传数据
            //3 上传数据
            this.showSubmit();
        });
        this.updata()
        this.postUrl("", () => { });
    }
    public updata(): void {
        console.log("更新cpaShow", main.chooseGameID);
        this.time.getComponent(cc.Label).string = "刷新于：" + new Date().toLocaleString();
        post({
            op: "getCPANames", game: main.chooseGameID
        }, (name) => {
            this.cpaName = name[0];
            // console.log(_cdn2 + main.chooseGameID + "/web/" + name);
            get({ url: _cdn2 + main.chooseGameID + "/web/" + this.cpaName + "?" + new Date().getTime() }, (rsp) => {
                this.myDecodeJSON(rsp);
                this.reqCpaData = rsp;
                console.log(this.reqCpaData);
                this.cpaShow.init(this.cpaArray, this.cpaPage);
            });
        });

    }
    public myDecodeJSON(rsp): void {
        //todo  创建一个数组，数组中保存cpa列表的所有属性
        this.cpaArray = [];
        let array = rsp.data.addturnlist;
        for (let item in array) {
            let cpaData: CpaData = {};
            cpaData.name = array[item].otherName;
            cpaData.appId = array[item].otherAppId;
            cpaData.path = array[item].otherIndexPath;
            cpaData.imgUrl = array[item].otherIconUrl;

            if (rsp.data.gameIcon1 && rsp.data.gameIcon1.itemlist.indexOf(item) > -1) {
                cpaData.cpa1 = true;
            } else {
                cpaData.cpa1 = false;
            }
            if (rsp.data.gameIcon2 && rsp.data.gameIcon2.itemlist.indexOf(item) > -1) {
                cpaData.cpa2 = true;
            } else {
                cpaData.cpa2 = false;
            }
            if (rsp.data.hutuiqiang && rsp.data.hutuiqiang.itemlist.indexOf(item) > -1) {
                cpaData.hutuiqiang = true;
            } else {
                cpaData.hutuiqiang = false;
            }
            if (rsp["苹果不显示"] && rsp["苹果不显示"].indexOf(cpaData.appId) > -1) {
                cpaData.IOS = false;
            } else {
                cpaData.IOS = true;
            }
            this.cpaArray[Number(item)] = cpaData;
        }
        console.log("myDecodeJSON");
        console.log(this.cpaArray);

    }
    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public showSubmit(): void {
        //1 判断是否有未填项
        for (let item in this.cpaArray) {
            let message = ""
            let curr = this.cpaArray[item];
            message += curr.imgUrl ? "" : " 图片";
            message += curr.name ? "" : " 游戏名";
            message += curr.appId ? "" : " appId";
            message += curr.path ? "" : " 路径";
            if (message !== null && message !== undefined && message !== '') {
                alert("第" + item + "项目的" + message + "未上传");
                return;
            }
        }

        this.decodeData();
    }
    public decodeData(): void {
        //2 整理上传数据

        // console.log("填写完毕开始塞入数据");
        // console.log("原数据")
        // console.log(JSON.stringify(this.reqCpaData))
        // console.log(this.imgDatas)

        let currdata = {};
        let gameIcon1Array = [];
        let gameIcon2Array = [];
        let hutuiqiangArray = [];
        let iosArray = [];
        this.cpbNames = [];
        this.reqCpaData.data["addturnlist"] = {};
        for (let item in this.cpaArray) {
            let curr = this.cpaArray[item];
            if (curr.urlBase64) {
                this.imgDatas.push([curr.imgUrl, curr.urlBase64]);
            }
            currdata[item] = {};
            currdata[item]["otherBannerUrl"] = "";
            currdata[item]["otherIconUrl"] = curr.imgUrl;
            currdata[item]["otherIndexPath"] = curr.path;
            currdata[item]["otherAppId"] = curr.appId;
            currdata[item]["otherBanner2Url"] = "";
            currdata[item]["otherInsertUrl"] = "";
            currdata[item]["otherName"] = curr.name;
            this.cpbNames.push(curr.name);
            if (curr.cpa1) {
                gameIcon1Array.push(item);
            }
            if (curr.cpa2) {
                gameIcon2Array.push(item);
            }
            if (curr.hutuiqiang) {
                hutuiqiangArray.push(item);
            }
            if (!curr.IOS) {
                iosArray.push(curr.appId);
            }
        }
        console.log(currdata);
        this.reqCpaData.data["addturnlist"] = currdata;
        if (gameIcon1Array.length > 0) {
            this.reqCpaData.data["gameIcon1"]["itemlist"] = gameIcon1Array;
        }
        if (gameIcon2Array.length > 0) {
            this.reqCpaData.data["gameIcon2"]["itemlist"] = gameIcon2Array;
        }
        if (hutuiqiangArray.length > 0) {
            this.reqCpaData.data["hutuiqiang"]["itemlist"] = hutuiqiangArray;
        }
        if (iosArray.length > 0) {
            this.reqCpaData["苹果不显示"] = iosArray;
        }
        console.log("待上传数据")
        console.log(this.cpaArray)
        this.submitCPB();
        this.submitCPA()
    }
    public submitCPA(): void {
        //3 上传数据
        // console.log(main.chooseGameID);
        // console.log(this.cpaName.split(/\.(\w+)/i)[0], "");
        // console.log(this.imgDatas);
        // console.log(this.cpaArray);
        console.log("填写完毕开始上传");

        post({
            op: "setCPA", game: main.chooseGameID, cpaName: this.cpaName.split(/\.(\w+)/i)[0], cpa: JSON.stringify(this.reqCpaData), imgDatas: JSON.stringify(this.imgDatas)
        }, (res) => {
            console.log(res)
            if (res.success) {
                alert("成功");
            } else {
                alert("失败");
            }
        });

    }
    public submitCPB(): void {
        console.log(this.cpbNames);
        this.drewTxt(this.cpbNames);
        //   this.drewImg(this.cpbNames);
    }
    public drewTxt(arrs: Array<string>): void {
        let drewCanvas = getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        ctx.font = "24px 微软雅黑";
        ctx.fillStyle = "#4774CB";
        //去重
        let NameRectMap = new Map();
        for (let index in arrs) {
            if (!NameRectMap.has(arrs[index])) {
                let y = parseInt(index) * 30;
                ctx.fillText(arrs[index], 755, y + 26);
                let txt = ctx.measureText(arrs[index]);
                NameRectMap.set(arrs[index], [755, y, Math.round(txt.width), Math.round(txt.actualBoundingBoxAscent + txt.actualBoundingBoxDescent)]);
            }
        }
        console.log(drewCanvas.toDataURL());
        // todo 保存图片，压缩图片
        //   URL.createObjectURL(blob_data)
        // get({
        //     url: " https://tinypng.com/images/panda-happy.png"
        // }, () => {

        // });
    }
    public postUrl(url, onComplete: (rsp: any) => void): void {

        console.log("post " + url);
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("post", "https://api.tinify.com/shrink", true);

        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YXBpOmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1');
        xhr.onload = () => {
            if (xhr.response) {
                console.log("post " + url + " 成功！");
                console.log(xhr.response);
            } else {
                console.error("post " + url + " 失败！");
            }
        };
        let a = {
            source: {
                "url": "https://tinypng.com/images/panda-happy.png"
            }
        }
        xhr.send(JSON.stringify(a));

    }
}