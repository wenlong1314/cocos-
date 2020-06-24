import { _cdn2, get, post, GameCode, CpaData, myCRC32 } from "./global";
import { Share } from "./Settings";
import { main } from "./Main";

import ShareShow from "./ShareShow";
declare let company: string;
declare let currIp: string;
const { ccclass, property } = cc._decorator;

// https://cdn-tiny.qimiaosenlin.com/cdn/cpa/00013193CEC37D18.png
@ccclass
export default class SharePage extends cc.Component {
    private submit: cc.Node;
    public btn: cc.Node;
    private shareShow: ShareShow;
    public time: cc.Node;
    public sharePage: SharePage;
    //  public cpaArray: { [key: string]: CpaData };
    public shareArray: Array<Share>;
    public cpaName: string;
    public imgDatas: Array<Array<string>> = [];
    public shareDatas: Array<object> = [];
    public init(): void {
        console.log("init SharePage");
        this.sharePage = this;
        this.submit = this.node.getChildByName("submit");
        this.btn = this.node.getChildByName("btn");
        this.time = this.node.getChildByName("time");
        this.shareShow = this.node.getChildByName("shareShow").getComponent(ShareShow);

        this.time.getComponent(cc.Label).string = "刷新于：" + new Date().toLocaleString();
        this.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            console.log("新增一个框");
            //console.log(this.shareArray);
            let item: Share = {};
            this.shareArray.push(item);
            this.shareShow.init(this.shareArray, this.sharePage, true);
        });

        this.submit.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            console.log("上传");
            //1 判断是否有未填项
            //2 整理上传数据
            //3 上传数据
            this.showSubmit();
        });
        this.updata();
    }
    public updata(): void {
        console.log("更新shareShow", main.chooseGameID);
        this.shareArray = main.settings.分享们b;
        this.shareShow.init(this.shareArray, this.sharePage);
    }

    public show(): void {
        this.time.getComponent(cc.Label).string = "刷新于：" + new Date().toLocaleString();
        this.updata();
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public showSubmit(): void {
        //1 判断是否有未填项
        for (let item in this.shareArray) {
            let message = ""
            let curr = this.shareArray[item];
            message += curr.imageUrl ? "" : " 图片";
            message += curr.title ? "" : " 描述";
            message += curr.query ? "" : " id";
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
        // console.log(this.imgDatas);
        this.shareDatas = [];
        for (let item in this.shareArray) {
            let currdata = {};
            let curr = this.shareArray[item];
            if (curr.urlBase64) {
                this.imgDatas.push([curr.imageUrl, curr.urlBase64]);
            }
            currdata["rate"] = 1;
            currdata["query"] = this.shareArray[item].query;
            currdata["title"] = this.shareArray[item].title;
            currdata["imageUrl"] = this.shareArray[item].imageUrl.indexOf("https:") > -1 ? this.shareArray[item].imageUrl : "https://cdn-tiny.qimiaosenlin.com/cdn/share/" + this.shareArray[item].imageUrl;
            this.shareDatas.push(currdata)
        }
        // console.log(this.shareDatas);
        main.settings.分享们b = this.shareDatas;
        main.settings.系统配置版本 = main.getTime();
        this.submitCPA();

    }
    public submitCPA(): void {
        //3 上传数据
        // 1 游戏名称，2数据数组，3图像数据[

        console.log("填写完毕开始上传");
        post({
            op: "setShares", company: company, currIp: currIp, game: main.chooseGameID, code: JSON.stringify(main.settings), imgDatas: JSON.stringify(this.imgDatas)
        }, (res) => {
            console.log(res)
            alert("提交成功");
        });
    }


}
