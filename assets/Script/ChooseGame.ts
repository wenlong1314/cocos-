import { _cdn2 } from "./global";
import ChooseBox from "./ChooseBox";
import { main } from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChooseGame extends cc.Component {
    @property(cc.Node)
    private btn2Prefab: cc.Node = null;
    public mengceng: cc.Node;
    public btn: cc.Node;
    private chooseBox: ChooseBox;
    private chooseGame: ChooseGame;

    public init(): void {
        console.log("init ChooseGame");
        this.chooseGame = this;
        this.btn = this.node.getChildByName("btn");
        this.mengceng = this.node.getChildByName("mengceng");
        this.chooseBox = this.node.getChildByName("chooseBox").getComponent(ChooseBox);
        this.btn.getChildByName("label").getComponent(cc.Label).string = main.chooseGameName;
        this.btn.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            this.mengceng.active = true;
            this.chooseBox.node.active = true;
            this.chooseBox.init(main.gamesNameShow, this.chooseGame);
        });
        this.mengceng.on(cc.Node.EventType.TOUCH_START, (evt: { target: cc.Node }) => {
            if (this.mengceng["flag"]) {
                return;
            }
            this.mengceng.active = false;
            this.chooseBox.node.active = false;
        });
        this.show();
    }
    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }


}
