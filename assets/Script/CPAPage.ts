import { _cdn2, get, post, CpaData, getDrewCanvas, gameRoot } from "./global";
import { main } from "./Main";
import CPAShow from "./CPAShow";
import CPBAPI from "./CPBAPI";


declare let company: string;
declare let currIp: string;
const { ccclass, property } = cc._decorator;

// https://cdn-tiny.qimiaosenlin.com/cdn/cpa/00013193CEC37D18.png
@ccclass
export default class CPAPage extends cc.Component {
    private submit: cc.Node;
    public btn: cc.Node;
    private cpaShow: CPAShow;
    public time: cc.Node;
    public mengceng: cc.Node;
    public cpaPage: CPAPage;
    public cpbAPI: CPBAPI;
    //  public cpaArray: { [key: string]: CpaData };
    public cpaArray: Array<CpaData>;
    public cpaName: string;
    public imgDatas: Array<Array<string>> = [];
    public reqCpaData: any;
    public cpbNames: Array<string>;
    public cpa1flag: boolean;
    public cpa2flag: boolean;

    public cpa1ToMore: boolean = false;
    public init(): void {
        console.log("init CPAPage");
        this.cpaPage = this;
        this.submit = this.node.getChildByName("submit");
        this.btn = this.node.getChildByName("btn");
        this.time = this.node.getChildByName("time");
        this.cpaShow = this.node.getChildByName("cpaShow").getComponent(CPAShow);

        this.cpbAPI = new CPBAPI();
        this.time.getComponent(cc.Label).string = "刷新于：" + new Date().toLocaleString();

        this.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            console.log(this.cpaArray);
            let item: CpaData = {
                IOS: true
            };
            this.cpaArray.push(item);
            this.cpaShow.init(this.cpaArray, this.cpaPage, true);
        });
        this.submit.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            console.log("上传");
            //1 判断是否有未填项
            //2 整理上传数据
            //3 上传数据
            main.hideByMengceng();
            this.showSubmit();
        });
        this.updata()
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
        console.dir(this.node)
        let cpa1 = this.node.getChildByName("cpa1").getComponent(cc.Toggle);
        let cpa2 = this.node.getChildByName("cpa2").getComponent(cc.Toggle);
        this.cpa1flag = rsp.CPA关;
        this.cpa2flag = rsp.加载页显示CPA;
        this.cpa1flag && cpa1.uncheck();
        !this.cpa2flag && cpa2.uncheck();
        cpa1.node.on('toggle', () => {
            this.cpa1flag = !this.cpa1flag;
        }, this);
        cpa2.node.on('toggle', () => {
            this.cpa2flag = !this.cpa2flag;
        }, this);

        let array = rsp.data.addturnlist;
        for (let item in array) {
            let cpaData: CpaData = {};
            cpaData.name = array[item].otherName;
            cpaData.appId = array[item].otherAppId;
            cpaData.path = array[item].otherIndexPath;
            cpaData.imgUrl = array[item].otherIconUrl;

            if (rsp.data.gameIcon1 && (rsp.data.gameIcon1.itemlist.indexOf(Number(item)) > -1 || rsp.data.gameIcon1.itemlist.indexOf(item) > -1)) {
                cpaData.cpa1 = true;
            } else {
                cpaData.cpa1 = false;
            }
            if (rsp.data.gameIcon2 && rsp.data.gameIcon2.itemlist.indexOf(Number(item)) > -1 || rsp.data.gameIcon1.itemlist.indexOf(item) > -1) {
                cpaData.cpa2 = true;
            } else {
                cpaData.cpa2 = false;
            }
            if (rsp.data.hutuiqiang && rsp.data.hutuiqiang.itemlist.indexOf(Number(item)) > -1 || rsp.data.gameIcon1.itemlist.indexOf(item) > -1) {
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
        let currdata = {};

        main.gameIcon1Array = [];
        main.gameIcon2Array = [];
        main.hutuiqiangArray = [];
        main.iosArray = [];
        let iosArray = [];

        this.cpbNames = [];
        let mainIcon = [];
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
                main.gameIcon1Array.push(Number(item));
            }
            if (curr.cpa2) {
                main.gameIcon2Array.push(Number(item));
            }
            if (curr.hutuiqiang) {
                main.hutuiqiangArray.push(Number(item));
            }
            if (!curr.IOS) {
                iosArray.push(curr.appId);
                main.iosArray.push(Number(item));
            }
            mainIcon.push(Number(item));
        }
        this.reqCpaData.data["addturnlist"] = currdata;


        this.reqCpaData.data["gameIcon1"]["itemlist"] = main.gameIcon1Array;
        this.reqCpaData.data["gameIcon2"]["itemlist"] = main.gameIcon2Array;
        this.reqCpaData.data["hutuiqiang"]["itemlist"] = main.hutuiqiangArray;
        this.reqCpaData["苹果不显示"] = iosArray;

        // if (main.gameIcon1Array.length > 0) {
        //     this.reqCpaData.data["gameIcon1"]["itemlist"] = main.gameIcon1Array;
        // }
        // if (main.gameIcon2Array.length > 0) {
        //     this.reqCpaData.data["gameIcon2"]["itemlist"] = main.gameIcon2Array;
        // }
        // if (main.hutuiqiangArray.length > 0) {
        //     this.reqCpaData.data["hutuiqiang"]["itemlist"] = main.hutuiqiangArray;
        // }
        // if (iosArray.length > 0) {
        //     this.reqCpaData["苹果不显示"] = iosArray;
        // }

        if (main.gameIcon1Array.length == (this.cpaArray.length - 1)) {
            console.log("推荐1全选")
            main.gameIcon1Array.pop();
            this.cpa1ToMore = true;
        } else {
            console.log("推荐1未全选", main.gameIcon1Array.length, this.cpaArray.length)
        }

        this.reqCpaData.data["mainIcons"]["itemlist"] = mainIcon;
        this.reqCpaData.data["mainIcon"]["itemlist"] = mainIcon;

        this.reqCpaData["加载页显示CPA"] = this.cpa2flag;
        this.reqCpaData["CPA关"] = this.cpa1flag;
        this.reqCpaData["CPA黑名单"] = main.blackArray;
        console.log("待上传数据")
        console.log(this.reqCpaData)
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
            op: "setCPA", company: company, currIp: currIp, game: main.chooseGameID, cpaName: this.cpaName.split(/\.(\w+)/i)[0], cpa: JSON.stringify(this.reqCpaData), imgDatas: JSON.stringify(this.imgDatas)
        }, (res) => {
            console.log(res)
            if (res.success) {
                //alert("成功");
                console.log("cpa提交成功");
            } else {
                alert("cpa提交失败");
            }
        });
    }
    public submitCPB(): void {
        this.cpbAPI.cpbSubmit(this.cpaArray, this.cpbNames, this.cpaName.replace("a", "b"), () => {
            main.showByMengceng();
            main.gameUpdata();
            if (this.cpa1ToMore) {
                alert("不能全部勾推荐1,系统已自动取消一个勾选")
            }
        });
        //   this.drewImg(this.cpbNames);
    }



}