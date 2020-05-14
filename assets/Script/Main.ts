import { _cdn2, get, post } from "./global";
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
@ccclass
export default class Main extends cc.Component {
    private configPage: ConfigPage;
    private removeStorage: removeStorage;
    private chooseGame: ChooseGame;
    private gmPage: GMPage;
    private cpaPage: CPAPage;
    private sharePage: SharePage;
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
    protected onLoad(): void {
        main = this;
        console.log("init main");
        window["main"] = this;
        this.tabs = this.node.getChildByName("tabs").children;
        this.configPage = this.node.getChildByName("pages").getChildByName("configPage").getComponent(ConfigPage);
        this.removeStorage = this.node.getChildByName("pages").getChildByName("removeStorage").getComponent(removeStorage);
        this.gmPage = this.node.getChildByName("pages").getChildByName("GMPage").getComponent(GMPage);
        this.cpaPage = this.node.getChildByName("pages").getChildByName("CPAPage").getComponent(CPAPage);
        this.sharePage = this.node.getChildByName("pages").getChildByName("SharePage").getComponent(SharePage);
        this.chooseGame = this.node.getChildByName("chooseGame").getComponent(ChooseGame);

        this.pages = ["configPage", "gmPage", "removeStorage", "cpaPage", "sharePage"];
        this.chooseGameName = "主公贼有钱";
        this.gamesNameShow = ["主公贼有钱", "火柴人冲突", "火柴人你瞅啥", "数字之城", "怪物冲突",
            "怪物工厂2", "天天上楼梯", "我开坦克贼6", "射了个箭", "我特能耍剑", "丧尸干仗", "天天炸飞机"];
        this.gameNames = new Map<string, string>([["主公贼有钱", "push"], ["火柴人冲突", "sword"], ["火柴人你瞅啥", "sword2"],
        ["数字之城", "sudoku"], ["怪物冲突", "rush2sword"], ["怪物工厂2", "rush2"], ["天天上楼梯", "climb"], ["我开坦克贼6", "tank"],
        ["射了个箭", "sword3"], ["我特能耍剑", "fight"], ["丧尸干仗", "zombie"], ["天天炸飞机", "plane"]]);

        this.chooseGameID = this.gameNames.get(this.chooseGameName);

        for (const tab of this.tabs) {
            tab.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
                this.tab(this.tabs.indexOf(evt.target));
            });
        }

        prefabs.init(() => {
            console.log("拉取预制体成功");
            this.settingFlag = true;
            this.pageInit();
        });

        get({ url: _cdn2 + this.chooseGameID + "/web/settings.json?" + new Date().getTime() }, (rsp: Settings) => {
            this.settings = rsp;
            this.prefabsFlag = true;
            this.pageInit();
        });

    }
    public pageInit(): void {
        if (this.settingFlag && this.prefabsFlag) {
            this.chooseGame.init();
            for (let index in this.pages) {
                this[this.pages[index]].init();
            }
            this.tab(0);
        }
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