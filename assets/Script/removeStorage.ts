import { _cdn2, get, post } from "./global";
import { main } from "./Main";

const { ccclass, property } = cc._decorator;
declare let wx: any;
@ccclass
export default class removeStorage extends cc.Component {

    private time: cc.Label;
    private input1: cc.EditBox;
    private input2: cc.EditBox;
    private submit: cc.Node;
    private inputs: Array<cc.EditBox>;
    private openId: string;
    public init(): void {
        console.log("init removeStorage");
        this.time = this.node.getChildByName("time").getComponent(cc.Label);
        this.submit = this.node.getChildByName("submit");
        this.input1 = this.node.getChildByName("input1").getComponent(cc.EditBox);
        this.input2 = this.node.getChildByName("input2").getComponent(cc.EditBox);

        this.submit.children[0].on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {


            // wx.chooseImage({
            //     count: 1, // 默认9
            //     sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
            //     sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            //     success: function (res) {
            //         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            //         var tempFilePaths = res.tempFilePaths;
            //         console.log("tempFilePaths" + tempFilePaths);
            //     },
            //     fail: function (res) {
            //         console.log("失败");
            //     },
            // })
            if (window["wx"]) {
                console.log("调取微信接口");
                wx.chooseImage({
                    success: function (res) {
                        console.log("成功");
                        // 5.2 图片预览
                    },
                    fail: function (res) {
                        console.log(res);
                    }
                });
            } else {
                post({ op: "removeStorage", game: main.chooseGameID, openId: this.openId }, rsp => {
                    alert(rsp.message);
                });
            }



        });

        this.inputs = [this.input1, this.input2];
        let i = -1;
        for (const input of this.inputs) {
            i++;
            let oldString = "";
            input.node.on('editing-did-began', (evt: { target: cc.Node }) => {
                oldString = input.string;
            });
            input.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                if (input.string != oldString) {
                    this.showSubmit();
                }
            });
        }
        this.show();
    }
    public showSubmit(): void {
        if (this.input1.string && this.input2.string) {
            this.submit.children[1].active = false;
            this.submit.children[0].active = true;
            this.time.string = "修改于：" + new Date().toLocaleString();
            this.openId = this.input2.string;
        } else {
            this.submit.children[1].active = true;
            this.submit.children[0].active = false;
            this.time.string = "";
            this.openId = "";
        }
    }
    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public updata(): void {
    }
}
