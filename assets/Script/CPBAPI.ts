import { _cdn2, get, gameRoot } from "./global";


const { ccclass, property } = cc._decorator;
//export let cpbAPI: CPBAPI;

@ccclass
export default class CPBAPI {
    public NameRectMap: Map<string, Array<number>> = new Map();
    public static ImgRectMap: Map<number, Array<number>> = new Map();//new Map([[1,[2]]])
    public reqAllData: any;

    public cpbSubmit(arrs: Array<string>, callback?: any) {
        let that = this;

        console.log(CPBAPI.ImgRectMap);
        console.log(this.NameRectMap);

        this.loadBottom("89b68afc-e961-480b-8fca-d5a82cef726e").then(
            (Texture2D: any) => {
                console.log(Texture2D["_image"]);
                that.drewImg(Texture2D["_image"], -2, Texture2D.width, Texture2D.height);
                this.drewTxt(arrs);
            }, (err) => console.log(err)
        ).then(
            () => {
                console.log("提交cpb图集开始")
                let promise1 = this.postTinyImg(this.reqAllData).then(
                    () => console.log("提交cpb图集成功"),
                    () => alert("提交cpb图集失败")
                )
                let promise2 = this.postCPBCode(this.reqAllData).then(
                    () => console.log("提交cpb数据成功"),
                    () => alert("提交cpb数据失败")
                )
                Promise.all([promise1, promise2]).then((num) => {
                    console.log("提交cpb成功");
                }).catch(() => alert("提交cpb失败"))
            }
        )

    }

    // 字是提交时填充大图
    public drewTxt(arrs: Array<string>): void {
        let drewCanvas = this.getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        ctx.font = "24px 微软雅黑";
        ctx.fillStyle = "#4774CB";
        //去重
        this.NameRectMap = new Map();
        for (let index in arrs) {
            if (!this.NameRectMap.has(arrs[index])) {
                let y = parseInt(index) * 30;
                ctx.fillText(arrs[index], 755, y + 26);
                let txt = ctx.measureText(arrs[index]);
                this.NameRectMap.set(arrs[index], [755, y, Math.round(txt.width), Math.round(txt.actualBoundingBoxAscent + txt.actualBoundingBoxDescent)]);
            }
        }
        // 文字底,图
        // ctx.drawImage(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)
        //  this.NamebottomRectMap(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)

        let reqData = drewCanvas.toDataURL().replace(/data:image\/.{0,9};base64,/i, "");
        console.log("替换后：");
        this.reqAllData = { "cpbAtlas": reqData, "cpbAtlasName": "cpbTmp" }

    }
    public loadBottom(uuid: string): Promise<void> {
        //文字底
        return new Promise((rs, rj) => {
            cc.loader.load({
                uuid: uuid, type: 'uuid'
            }, function (err, Texture2D) {
                err ? rj(err) : rs(Texture2D);
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
    public decodeCPBData(data): void {


    }
    public postCPBCode(data): Promise<void> {
        //1 准备数据，2上传，3调用
        return new Promise((rs, rj) => {
            // $.post(gameRoot + "cpbcode.php", data, rsp => {
            //     if (rsp) {
            //         rs(rsp);
            //     } else {
            //         if (rj) {
            //             rj(rsp);
            //         }
            //     }
            // });
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
    public drewImg(tmpImg: HTMLImageElement, index: number, width: number, height: number, fix?: boolean): void {
        let drewCanvas = this.getDrewCanvas();
        const ctx = drewCanvas.getContext("2d");
        console.log(1);
        let x = Math.floor(index / 6);
        let y = index % 6;
        fix && ctx.clearRect(x * 150, y * 150, 150, 150);
        if (index < -1) {
            ctx.drawImage(tmpImg, 0, 0, width, height, 970, 970, width, height);// 文字底，固定
        } else {
            ctx.drawImage(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)
        }
        CPBAPI.ImgRectMap.set(index, [970, 970, width, height]);
        let drewUrlBase64 = drewCanvas.toDataURL();
        (fix || index < -1) && console.log(drewUrlBase64);
        //  console.log("这是第" + index + "个" + x + "行" + y);
        // console.log(CPBAPI.ImgRectMap)
    }
}

