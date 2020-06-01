import { _cdn2, get, gameRoot } from "./global";
import { main } from "./Main";


const { ccclass, property } = cc._decorator;
//export let cpbAPI: CPBAPI;

@ccclass
export default class CPBAPI {
    public NameRectMap: Map<string, Array<number>> = new Map();
    public static ImgRectMap: Map<number, Array<number>> = new Map();//new Map([[1,[2]]])
    public reqAllData: any;
    public reqCPBData: any;
    public crc32name: string;
    public cpbName: string;

    public cpbSubmit(reqCpaData: any, nameArrs: Array<string>, cpbName: string, callback?: any) {
        this.cpbName = cpbName;
        this.loadBottom("89b68afc-e961-480b-8fca-d5a82cef726e").then(
            (SpriteFrame: any) => {
                //  console.log(Texture2D["_image"]);
                let Texture2D = SpriteFrame["_texture"];
                this.drewImg(Texture2D["_image"], -2, Texture2D.width, Texture2D.height);
                this.drewTxt(nameArrs);
                console.log(CPBAPI.ImgRectMap);
                console.log(this.NameRectMap);
            }, (err) => console.log(err)
        ).then(
            () => {
                console.log("提交cpb图集开始");
                return this.postTinyImg(this.reqAllData);
            }
        ).then(
            (data: any) => {
                let code = JSON.parse(data);
                this.crc32name = code["name"];
                return this.postCPBCode(reqCpaData);
            },
            () => alert("提交cpb图集失败")
        ).then(
            (data: any) => {
                if (data.success) {
                    alert("提交cpb数据成功");
                } else {
                    alert("提交cpb数据失败");
                }
            },
            () => alert("提交cpb数据失败")
        )

    }

    // 字是提交时填充大图
    public drewTxt(arrs: Array<string>): void {
        let drewCanvas = this.getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        ctx.font = "20px 微软雅黑";
        ctx.fillStyle = "#ffffff";
        //去重
        this.NameRectMap = new Map();
        for (let index in arrs) {
            if (!this.NameRectMap.has(arrs[index])) {
                let y = parseInt(index) * 30;
                ctx.fillText(arrs[index], 755, y + 19);
                 
                let txt = ctx.measureText(arrs[index]);
                this.NameRectMap.set(arrs[index], [755, y, Math.round(txt.width), Math.round(txt.actualBoundingBoxAscent + txt.actualBoundingBoxDescent)]);
            }
        }
        // 文字底,图
        // ctx.drawImage(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)
        //  this.NamebottomRectMap(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)

        let reqData = drewCanvas.toDataURL().replace(/data:image\/.{0,9};base64,/i, "");
        //  console.log("替换后：");
        this.reqAllData = { "cpbAtlas": reqData, "cpbAtlasName": "cpbTmp" }

    }
    public loadBottom2(uuid: string): Promise<void> {
        //文字底
        return new Promise((rs, rj) => {
            cc.loader.load({
                uuid: uuid, type: 'uuid'
            }, function (err, Texture2D) {
                err ? rj(err) : rs(Texture2D);
            })
        })
    }
    public loadBottom(uuid: string): Promise<void> {
        //文字底
        return new Promise((rs, rj) => {
            cc.loader.loadRes('ui/cpb文字底', cc.SpriteFrame, function (err, SpriteFrame) {
                //  err ? rj(err) : rs(Texture2D);
                if (err) {
                    cc.error(err.message || err);
                    return;
                } else {
                    console.log("11111");
                    rs(SpriteFrame);
                }
            })
        })
    }
    public postTinyImg(data): Promise<void> {
        // let data = { "0": "https://tinypng.com/images/panda-happy.png" };// url 写法
        return new Promise((rs, rj) => {
            $.post(gameRoot + "tinypng.php", data, rsp => {
                if (rsp) {
                    rs(rsp);
                } else {
                    if (rj) {
                        rj(rsp);
                    }
                }
            });
        })
    }
    public decodeCPBData(arrs): void {
        // todo. 1 数据字段对应含义，2塞参数
        this.reqCPBData = {};
        let cpbs = [];
        console.log("iconRect")
        console.log(CPBAPI.ImgRectMap)
        for (let curr in arrs) {
            let tmp = {};
            let item = arrs[curr];
            tmp["appId"] = item.appId;
            tmp["name"] = item.name;
            tmp["nameRect"] = this.NameRectMap.get(item.name);
            tmp["path"] = item.path;
            tmp["iconRect"] = CPBAPI.ImgRectMap.get(Number(curr));
            cpbs.push(tmp);
        }
        this.reqCPBData["开"] = true;
        this.reqCPBData["加载页显示"] = true;
        this.reqCPBData["黑名单"] = main.blackArray;
        this.reqCPBData["atlas"] = this.crc32name;
        this.reqCPBData["文字底"] = CPBAPI.ImgRectMap.get(-2);
        this.reqCPBData["cpbs"] = cpbs;

        if (main.gameIcon1Array.length > 0) {
            this.reqCPBData["推荐1"] = main.gameIcon1Array;
        }
        if (main.gameIcon2Array.length > 0) {
            this.reqCPBData["推荐2"] = main.gameIcon2Array;
        }
        if (main.hutuiqiangArray.length > 0) {
            this.reqCPBData["hutuiqiang"] = main.hutuiqiangArray;
        }
        if (main.iosArray.length > 0) {
            this.reqCPBData["苹果不显示"] = main.iosArray;
        }
        console.log("cpb 数据");
        console.log(this.reqCPBData);
    }
    public postCPBCode(arrs): Promise<void> {
        this.decodeCPBData(arrs);
        let data = { "game": main.chooseGameID, "cpb": JSON.stringify(this.reqCPBData), "cpbName": this.cpbName };
        //1 准备数据，2上传，3调用
        return new Promise((rs, rj) => {
            $.post(gameRoot + "setCPBdata.php", data, rsp => {
                if (rsp) {
                    rs(rsp);
                } else {
                    if (rj) {
                        rj(rsp);
                    }
                }
            });
        })
    }

    public getDrewCanvas(): HTMLCanvasElement {
        if (document.getElementById("drewCanvas")) {
        } else {
            var canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            canvas.width = 1024; //☜
            canvas.height = 1024;
            canvas.style.backgroundColor = '#FF0000';
            canvas.id = "drewCanvas";
        }
        return document.getElementById("drewCanvas") as HTMLCanvasElement;
    }
    // 图是获取时，填充大图，修改后自动修改大图。
    public drewImg(tmpImg: HTMLImageElement, curr: number, width: number, height: number, fix?: boolean): void {
        let drewCanvas = this.getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        let x = Math.floor((curr - 1) / 6);
        let y = (curr - 1) % 6;
        fix && ctx.clearRect(x * 150, y * 150, 150, 150);
        if (curr < -1) {
            ctx.drawImage(tmpImg, 0, 0, width, height, 970, 970, width, height);// 文字底，固定
            CPBAPI.ImgRectMap.set(curr, [970, 970, width, height]);
        } else {
            ctx.drawImage(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)
            CPBAPI.ImgRectMap.set(curr, [x * 150, y * 150, width, height]);
        }

        let drewUrlBase64 = drewCanvas.toDataURL();
        //(fix || index < -1) && console.log(drewUrlBase64);

        //  console.log("这是第" + index + "个" + x + "行" + y);
        // console.log(CPBAPI.ImgRectMap)
    }
}

