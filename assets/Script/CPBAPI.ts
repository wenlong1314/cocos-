import { _cdn2, get, gameRoot } from "./global";


const { ccclass, property } = cc._decorator;
//export let cpbAPI: CPBAPI;

@ccclass
export default class CPBAPI {
    public NameRectMap: any;
    public ImgRectMap: any;
    public namebottomRectMap: any;
    public reqAllData: any;
    public cpbSubmit(arrs: Array<string>, callback?: any) {

        this.drewTxt(arrs);
        let promise1 = this.postTinyImg(this.reqAllData).then(
            () => {
                console.log("提交cpb图集成功");
            },
            () => {
                alert("提交cpb图集失败");
            }
        )
        let promise2 = this.postCPBCode(this.reqAllData).then(
            () => {
                console.log("提交cpb数据成功");
            },
            () => {
                alert("提交cpb数据失败");
            }
        )
        Promise.all([promise1, promise2]).then((num) => {
            console.log("提交cpb成功");
        }).catch(() => alert("提交cpb失败"))
      
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

        let x = Math.floor(index / 6);
        let y = index % 6;
        fix && ctx.clearRect(x * 150, y * 150, 150, 150);

        ctx.drawImage(tmpImg, 0, 0, width, height, x * 150, y * 150, width, height)
        this.ImgRectMap = new Map();
        this.ImgRectMap.set(index, [x * 150, y * 150, width, height]);
        let drewUrlBase64 = drewCanvas.toDataURL();
        fix && console.log(drewUrlBase64);
        console.log("这是第" + index + "个" + x + "行" + y)
    }
}

