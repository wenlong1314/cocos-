import { _cdn2, get, post } from "./global";
import { main } from "./Main";

const { ccclass, property } = cc._decorator;
declare let company: string;
declare let currIp: string;
@ccclass
export default class ConfigPage extends cc.Component {

    private 系统配置txt: cc.Label;
    private time: cc.Label;
    private a: cc.Node;
    private 误触关: cc.Node;
    private 分享关: cc.Node;
    private CPA关: cc.Node;
    private input1: cc.EditBox;
    private input2: cc.EditBox;
    private input3: cc.EditBox;
    private input4: cc.EditBox;
    private input5: cc.EditBox;
    private input6: cc.EditBox;
    private submit: cc.Node;
    private nodes: Array<string>;
    private inputs: Array<cc.EditBox>;

    private settingsInput: Array<string>;;
    public init(): void {
        console.log("init ConfigPage");

        this.系统配置txt = this.node.getChildByName("系统配置txt").getComponent(cc.Label);
        this.time = this.node.getChildByName("time").getComponent(cc.Label);
        this.a = this.node.getChildByName("总开关");
        this.误触关 = this.node.getChildByName("误触开关");
        this.分享关 = this.node.getChildByName("分享开关");
        this.CPA关 = this.node.getChildByName("cpa开关");
        this.submit = this.node.getChildByName("submit");
        this.input1 = this.node.getChildByName("input1").getComponent(cc.EditBox);
        this.input2 = this.node.getChildByName("input2").getComponent(cc.EditBox);
        this.input3 = this.node.getChildByName("input3").getComponent(cc.EditBox);
        this.input4 = this.node.getChildByName("input4").getComponent(cc.EditBox);
        this.input5 = this.node.getChildByName("input5").getComponent(cc.EditBox);
        this.input6 = this.node.getChildByName("input6").getComponent(cc.EditBox);
        this.nodes = ["a", "误触关", "分享关", "CPA关"];
        this.inputs = [this.input1, this.input2, this.input3, this.input4, this.input5, this.input6];
        this.settingsInput = ["微信合成点击完毕出现Banner", "游戏左下角Banner显示概率", "CPA黑名单", "误触白名单", "误触白名单1", "误触白名单2"];

        this.updata();

        this.submit.children[0].on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            //console.log(main.settings);
            main.settings.系统配置版本 = main.getTime();
            if (main.settings["cpa关"]) {
                delete main.settings["cpa关"];
            }
            console.log(main.settings);
            post({ op: "setSettings", currIp: currIp, company: company, game: main.chooseGameID, code: JSON.stringify(main.settings) }, rsp => {

                let nums = this.input3.string.replace(/[^\d,,，。.;\n\t-]/g, "").split(/[,，。.;\n\t]/).filter((value) => {
                    if (value) { return value }
                })
                main.blackArray = nums.map((curr) => {
                    return Number(curr);
                });
                console.log("黑名单数据：" + main.blackArray)
                alert("修改配置文件成功！");
            });
        });
        let i = -1;
        for (const input of this.inputs) {
            i++;
            let oldString = "";
            input["index"] = i;
            input.node.on('editing-did-began', (evt: { target: cc.Node }) => {
                oldString = input.string;
            });
            input.node.on('editing-did-ended', () => {
                if (input.string != oldString) {
                    this.submit.children[1].active = false;
                    this.submit.children[0].active = true;
                    this.time.string = "修改与：" + new Date().toLocaleString();
                    let nums = input.string.replace(/[^\d,,，。.;\n\t-]/g, "").split(/[,，。.;\n\t]/).filter((value) => {
                        if (value) { return value }
                    })
                    let tmp = nums.map((curr) => {
                        return Number(curr);
                    })
                    main.settings["" + this.settingsInput[input["index"]]] = tmp;
                    input.string = nums.toString();
                    console.log("修改值");
                    //  console.log(main.settings["" + this.settingsInput[i]])
                }
            });
        }
    }

    public changeNode(node: string): void {
        this["" + node].children[1].active = !this["" + node].children[1].active;
        this["" + node].children[0].active = !this["" + node].children[0].active;
        main.settings["" + node] = !main.settings["" + node];
        this.submit.children[1].active = false;
        this.submit.children[0].active = true;
        this.time.string = "修改与：" + new Date().toLocaleString();
        console.log(node + main.settings["" + node]);

    }

    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }
    public updata(): void {
        console.log("更新配置文件页面", main.chooseGameID);
        this.系统配置txt.string = "系统配置版本：" + main.settings.系统配置版本;
        this.input1.string = (main.settings.微信合成点击完毕出现Banner + "" || 0) + "";
        this.input2.string = (main.settings.游戏左下角Banner显示概率 || 0) + "";
        this.input3.string = (main.settings.CPA黑名单 || 0) + "";
        this.input4.string = (main.settings.误触白名单 || 0) + "";
        this.input5.string = (main.settings.误触白名单1 || 0) + "";
        this.input6.string = (main.settings.误触白名单2 || 0) + "";
        for (const node of this.nodes) {
            console.log(node)
            this["" + node].children[1].active = main.settings["" + node];
            this["" + node].children[0].active = !main.settings["" + node];

            this["" + node].off(cc.Node.EventType.TOUCH_START);

            this["" + node].on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
                this.changeNode(node);
            });
           
        }
        let nums = this.input3.string.replace(/[^\d,,，。.;\n\t-]/g, "").split(/[,，。.;\n\t]/).filter((value) => {
            if (value) { return value }
        })
        main.blackArray = nums.map((curr) => {
            return Number(curr);
        });
        console.log("黑名单数据：" + main.blackArray)
    }
}
