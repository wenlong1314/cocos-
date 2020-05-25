import { _cdn2, get } from "./global";
import Settings from "./Settings";
import ConfigPage from "./ConfigPage";
import removeStorage from "./removeStorage";
import GMPage from "./GMPage";
import { prefabs } from "./prefabs";
import ChooseGame from "./ChooseGame";
import CPAPage from "./CPAPage";
import SharePage from "./SharePage";

const { ccclass, property } = cc._decorator;
export let main: Main;
declare let company: string;
declare let wx: any;
@ccclass
export default class Main extends cc.Component {
    private configPage: ConfigPage;
    private removeStorage: removeStorage;
    private gmPage: GMPage;
    private cpaPage: CPAPage;
    private sharePage: SharePage;
    private chooseGame: ChooseGame;
    private pages: Array<any>;
    private tabs: Array<cc.Node>;
    public settings: Settings;
    public chooseGameID: string;
    public currPageIndex: number;
    public chooseGameName: string;
    public gamesNameShow: Array<any>;
    public gameNames: Map<string, string>;
    public gameNames2: { [key: string]: string } = { "天天炸飞机": "plane" };
    private settingFlag: boolean = false;
    private prefabsFlag: boolean = false;
    protected async onLoad(): Promise<void> {
        main = this;
        console.log("init main");
        window["main"] = this;
        if (!window["company"]) {
            console.log("debugger");
            company = "";
        }
        this.tabs = this.node.getChildByName("tabs").children;
        this.configPage = this.node.getChildByName("pages").getChildByName("configPage").getComponent(ConfigPage);
        this.removeStorage = this.node.getChildByName("pages").getChildByName("removeStorage").getComponent(removeStorage);
        this.gmPage = this.node.getChildByName("pages").getChildByName("GMPage").getComponent(GMPage);
        this.cpaPage = this.node.getChildByName("pages").getChildByName("CPAPage").getComponent(CPAPage);
        this.sharePage = this.node.getChildByName("pages").getChildByName("SharePage").getComponent(SharePage);
        this.chooseGame = this.node.getChildByName("chooseGame").getComponent(ChooseGame);

        this.pages = ["configPage", "gmPage", "removeStorage", "cpaPage", "sharePage"];

        //if(window["wx"]){wx.setEnableDebug({ enableDebug: true });} 

        console.log(`company=${company}`);
        //  console.log(`company=${window["company"]}`);

        switch (company) {
            case "梦嘉":
                this.chooseGameName = "火柴人冲突";
                this.gamesNameShow = ["火柴人冲突", "怪物工厂2", "射了个箭"];
                this.gameNames = new Map<string, string>([
                    ["火柴人冲突", "sword"], ["怪物工厂2", "rush2"], ["射了个箭", "sword3"]
                ]);
                break;
            case "雷霆":
                this.chooseGameName = "火柴人你瞅啥";
                this.gamesNameShow = ["火柴人你瞅啥", "我特能耍剑", "丧尸干仗"];
                this.gameNames = new Map<string, string>([
                    ["火柴人你瞅啥", "sword2"], ["我特能耍剑", "fight"], ["丧尸干仗", "zombie"]]);
                break;
            case "奇妙":
                this.chooseGameName = "主公贼有钱";
                this.gamesNameShow = ["主公贼有钱", "火柴人冲突", "火柴人你瞅啥", "数字之城", "怪物冲突",
                    "怪物工厂2", "天天上楼梯", "我开坦克贼6", "射了个箭", "我特能耍剑", "丧尸干仗", "天天炸飞机"];
                this.gameNames = new Map<string, string>([["主公贼有钱", "push"], ["火柴人冲突", "sword"], ["火柴人你瞅啥", "sword2"],
                ["数字之城", "sudoku"], ["怪物冲突", "rush2sword"], ["怪物工厂2", "rush2"], ["天天上楼梯", "climb"], ["我开坦克贼6", "tank"],
                ["射了个箭", "sword3"], ["我特能耍剑", "fight"], ["丧尸干仗", "zombie"], ["天天炸飞机", "plane"]]);
                break;
            default:
                this.chooseGameName = "主公贼有钱";
                this.gamesNameShow = ["主公贼有钱"];
                this.gameNames = new Map<string, string>([["主公贼有钱", "push"]]);
                break;

        }

        //     this.chooseGameName = "主公贼有钱";
        //     this.gamesNameShow = ["主公贼有钱", "火柴人冲突", "火柴人你瞅啥", "数字之城", "怪物冲突",
        //         "怪物工厂2", "天天上楼梯", "我开坦克贼6", "射了个箭", "我特能耍剑", "丧尸干仗", "天天炸飞机"];
        //     this.gameNames = new Map<string, string>([["主公贼有钱", "push"], ["火柴人冲突", "sword"], ["火柴人你瞅啥", "sword2"],
        //     ["数字之城", "sudoku"], ["怪物冲突", "rush2sword"], ["怪物工厂2", "rush2"], ["天天上楼梯", "climb"], ["我开坦克贼6", "tank"],
        //     ["射了个箭", "sword3"], ["我特能耍剑", "fight"], ["丧尸干仗", "zombie"], ["天天炸飞机", "plane"]]);



        this.chooseGameID = this.gameNames.get(this.chooseGameName);

        for (const tab of this.tabs) {
            tab.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
                this.tab(this.tabs.indexOf(evt.target));
            });
        }

        let promise1 = this.prefabsLoad().then(() => {
            console.log("任务1成功")
        });
        let promise2 = this.getSetting().then(() => {
            console.log("任务2成功")
        });;
        Promise.all([promise1, promise2]).then(() => {
            console.log("任务完成");
            this.pageInit();
        })

    }
    public pageInit(): void {
        this.chooseGame.init();
        for (let index in this.pages) {
            this[this.pages[index]].init();
        }
        this.tab(0);        
    }
    public prefabsLoad(): Promise<string> {
        return new Promise((rs, rj) => {
            prefabs.init(() => { rs(); });
           
        })
    }

    public getSetting(): Promise<string> {
        return new Promise((rs, rj) => {
            get({ url: _cdn2 + this.chooseGameID + "/web/settings.json?" + new Date().getTime() }, (rsp: Settings) => {
                this.settings = rsp;
                rs();
            });
        })
    }

    public gameUpdata(): void {
        console.log("settings:", this.chooseGameID);
        get({ url: _cdn2 + this.chooseGameID + "/web/settings.json?" + new Date().getTime() }, (rsp: Settings) => {
            this.settings = rsp;
            for (let index in this.pages) {
                this[this.pages[index]].updata();
            }
            this.tab(main.currPageIndex);
        });
    }
    public async syncAdd(num1, num2, time, callback): Promise<void> {
        setTimeout(() => {
            callback(num1, num2);
        }, time);
        //this.getPrimise("1",(res)=>{},1)
    }
    public getTime(): string {
        let time = new Date();
        let mydata =
            time.getUTCFullYear() +
            (100 + (time.getMonth() + 1)).toString().substring(1) +
            (100 + time.getDay()).toString().substring(1) +
            (100 + time.getHours()).toString().substring(1) +
            (100 + time.getMinutes()).toString().substring(1) +
            (100 + time.getSeconds()).toString().substring(1);
        return mydata;
    }
    private tab(index: number): void {
        let i: number = -1;
        for (let tab of this.tabs) {
            i++;
            if (i == index) {
                tab.children[0].active = false;
                tab.children[1].active = true;
                if (this.pages[i] != '') {
                    this[this.pages[i]].show();
                }
                main.currPageIndex = index;
            } else {
                tab.children[0].active = true;
                tab.children[1].active = false;
                if (this.pages[i] != '') {
                    this[this.pages[i]].hide();
                }
            }
        }


    }

}
