import { _cdn2, get, gameRoot, getDrewCanvas } from "./global";
import { main } from "./Main";


const { ccclass, property } = cc._decorator;
//export let cpbAPI: CPBAPI;
declare let company: string;
@ccclass
export default class CPBAPI {
    public NameRectMap: Map<string, Array<number>> = new Map();
    public static ImgRectMap: Map<number, Array<number>> = new Map();//new Map([[1,[2]]])
    public reqAllData: any;
    public reqCPBData: any;
    public crc32name: string;
    public cpbName: string;

    public cpbSubmit(reqCpaData: any, nameArrs: Array<string>, cpbName: string, callback?: any) {
        console.log("cpb提交开始")
        this.cpbName = cpbName;
        let successArray = [];

        // let chunks = new Blob(['1111'])
        // this.reqAllData = { "cpbAtlas": chunks, "cpbAtlasName": "cpbTmp" };
        // this.postTinyImg(this.reqAllData);

        this.loadBottom("89b68afc-e961-480b-8fca-d5a82cef726e").then(
            (SpriteFrame: any) => {
                //  console.log(Texture2D["_image"]);
                let Texture2D = SpriteFrame["_texture"];
                this.drewImg(Texture2D["_image"], -2, Texture2D.width, Texture2D.height);
                successArray.push("图片转换Blob失败");
                return this.drewTxt(nameArrs);
            }
        ).then(
            () => {
                console.log("提交cpb图集开始");
                successArray.push("提交cpb图集失败");
                return this.postTinyImg(this.reqAllData);
            }
        ).then(
            (data: any) => {
                let code = JSON.parse(data);
                this.crc32name = code["name"];
                successArray.push("提交cpb数据失败");
                return this.postCPBCode(reqCpaData);
            }
        ).then(
            (data: any) => {
                if (data.success) {
                    alert("提交数据成功");
                } else {
                    alert("提交数据失败");
                }
                callback && callback();
            }
        ).catch(
            () => {
                alert(successArray.pop());
                callback && callback();
            }
        )


    }

    // 字是提交时填充大图
    public drewTxt(arrs: Array<string>): Promise<void> {
        return new Promise((rs, rj) => {
            let drewCanvas = getDrewCanvas();
            const ctx = drewCanvas.getContext("2d");
            ctx.font = "normal bold 20px 微软雅黑";
            ctx.fillStyle = "#ffffff";
            //去重
            this.NameRectMap = new Map();
            ctx.clearRect(755, 0, 150, 800);
            for (let index in arrs) {
                if (!this.NameRectMap.has(arrs[index])) {
                    let y = parseInt(index) * 30;
                    ctx.fillText(arrs[index], 757, y + 19 + 3);
                    let txt = ctx.measureText(arrs[index]);
                    // console.log("文字信息")
                    // console.dir(txt)
                    this.NameRectMap.set(arrs[index], [755, y + 2, Math.round(txt.width) + 4, Math.round(txt.actualBoundingBoxAscent + txt.actualBoundingBoxDescent) + 6 | 26]);
                }
            }
            /**
             *  Blob
             */

            drewCanvas.toBlob((blob) => {
                let blobUrl = URL.createObjectURL(blob);
                const LENGTH = 1024 * 1024 * 0.1;
                let chunks = blob.slice(0, 100);
                //  var file = new File([blob], "cpbTmp.png");
                this.reqAllData = { "cpbAtlas": blob, "cpbAtlasName": "cpbTmp" };
                console.log("blobUrl====");
                console.log(blob);
                // console.log(file);
                // 不需要手动删除  URL.revokeObjectURL(blobUrl);
                rs();
            }, "image/png");
            /**
             *  base64
             */
            // let reqData = drewCanvas.toDataURL().replace(/data:image\/.{0,9};base64,/i, "");
            // this.reqAllData = { "cpbAtlas": reqData, "cpbAtlasName": "cpbTmp" }
        })
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

                    rs(SpriteFrame);

                }
            })
        })
    }
    public postTinyImg(data): Promise<string> {
        return new Promise((resolve, reject) => {
            console.log(this.reqAllData)
            let fd = new FormData();
            fd.append("cpbAtlas", this.reqAllData["cpbAtlas"]);
            fd.append("cpbAtlasName", this.reqAllData["cpbAtlasName"]);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (rsp) => {
                let state = xhr.readyState;
                if (state === 4 && xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText);
                    console.log(response)
                    if (response.success) {
                        resolve(xhr.responseText);
                    } else {
                        reject()
                    }

                    // resolve.apply(xhr, xhr.responseText);
                }
            };
            xhr.onerror = err => {
                reject(err);
            };
            xhr.ontimeout = function () {
                console.error('The request for  timed out.');
                reject('The request for  timed out.');
            };
            console.log('设置请求超时timed out.');
            xhr.timeout = 100 * 1000;
            xhr.open("POST", gameRoot + "tinypng1.php", true);
            xhr.send(fd);

        });


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
        //this.reqCPBData["黑名单"] = main.blackArray;

        // if (this.reqCPBData["CPA黑名单"]) {
        //     delete this.reqCPBData["CPA黑名单"];
        //     console.log("存在删除cpb黑名单")
        // }
        this.reqCPBData["atlas"] = this.crc32name;
        this.reqCPBData["文字底"] = CPBAPI.ImgRectMap.get(-2);
        this.reqCPBData["cpbs"] = cpbs;

        if (main.gameIcon1Array.length > 0) {
            this.reqCPBData["推荐1"] = main.gameIcon1Array.map((curr) => {
                return curr - 1;
            });
        }
        if (main.gameIcon2Array.length > 0) {
            this.reqCPBData["推荐2"] = main.gameIcon2Array.map((curr) => {
                return curr - 1;
            });
        }
        if (main.hutuiqiangArray.length > 0) {
            this.reqCPBData["hutuiqiang"] = main.hutuiqiangArray.map((curr) => {
                return curr - 1;
            });
        }
        if (main.iosArray.length > 0) {
            this.reqCPBData["苹果不显示"] = main.iosArray.map((curr) => {
                return curr - 1;
            });
        }
        console.log("cpb 数据1111");
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
    // 图是获取时，填充大图，修改后自动修改大图。
    public drewImg(tmpImg: HTMLImageElement, curr: number, width: number, height: number, fix?: boolean): void {
        let drewCanvas = getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        let x = Math.floor((curr - 1) / 6);
        let y = (curr - 1) % 6;
        ctx.clearRect(x * 150, y * 150, 150, 150);
        if (curr < - 1) {
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

