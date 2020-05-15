import { _cdn2, post, GameCode } from "./global";
import Settings from "./Settings";
import ChooseBox from "./ChooseBox";
import CodeShow from "./CodeShow";
import { main } from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GMPage extends cc.Component {
    private input1: cc.EditBox;
    private input2: cc.EditBox;

    private submit: cc.Node;
    public btn: cc.Node;
    public mengceng: cc.Node;
    private chooseBox: ChooseBox;

    private nodes: Array<string>;
    private inputs: Array<cc.EditBox>;
    private settings: Settings;
    private settingsInput: Array<string>;
    private arrs: Array<string>;
    private codeArrays: Array<GameCode>;
    private gmPage: GMPage;
    private codeShow: CodeShow;
    public init(): void {
        console.log("init GMPage");
        this.gmPage = this;
        this.submit = this.node.getChildByName("submit");
        this.btn = this.node.getChildByName("btn");
        this.mengceng = this.node.getChildByName("mengceng");
        this.chooseBox = this.node.getChildByName("chooseBox").getComponent(ChooseBox);
        this.input1 = this.node.getChildByName("input1").getComponent(cc.EditBox);
        this.input2 = this.node.getChildByName("input2").getComponent(cc.EditBox);
        this.codeShow = this.node.getChildByName("codeShow").getComponent(CodeShow);

        this.arrs = ["+金币", "+钻石", "+体力", "+视频", "+提示"];
        //  this.codeArrays = [["111", "222", "333"], ["222", "123", "123"], ["333", "123", "123"], ["444", "123", "123"]];


        this.inputs = [this.input1, this.input2];
        this.mengceng.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            this.chooseBox.hide();
            this.mengceng.active = false;
        })
        this.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            this.mengceng.active = true;
            this.chooseBox.node.active = true;
            this.chooseBox.init(this.arrs, this.gmPage);
        });
        this.submit.children[0].on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            post({ op: "addCode", game: main.chooseGameID, info: (this.btn.getChildByName("label").getComponent(cc.Label).string + this.input1.string), times: this.input2.string }, rsp => {
                this.updata();
            });
        });
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
            })
        }
        this.updata();
    }
    public updata(): void {
        console.log("getCodes:", main.chooseGameID);
        post({ op: "getCodes", game: main.chooseGameID }, (rsp: Array<GameCode>) => {
            this.codeArrays = rsp;
            console.log(rsp);
            this.codeShow.init(this.codeArrays, this.gmPage);
        });
    }
    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public showSubmit(): void {
        if (this.input1.string && this.input2.string) {
            this.submit.children[1].active = false;
            this.submit.children[0].active = true;
        } else {
            this.submit.children[1].active = true;
            this.submit.children[0].active = false;

        }
    }
}
