import { _cdn2, chooseBoxPage } from "./global";
import { prefabs } from "./prefabs";
import  { main } from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChooseBox extends cc.Component {

    public init(arrs: Array<string>, gmPage: chooseBoxPage): void {
        console.log("init ChooseBox");
        this.node.removeAllChildren();

        for (let index in arrs) {
            let item: cc.Node = prefabs.instantiate("ChooseBoxItem");
            let txt = item.getChildByName("tab1").getChildByName("label").getComponent(cc.Label);
            txt.string = arrs[index];
            item.y = - (index) * 60 - 60;
            this.node.addChild(item);
            item.on(cc.Node.EventType.TOUCH_START, () => {
                gmPage.mengceng.active = false;
                gmPage.btn.getChildByName("label").getComponent(cc.Label).string = arrs[index];
                if (main.gameNames.has(arrs[index])) {
                    console.log("zhans");
                    main.chooseGameID = main.gameNames.get(arrs[index]);
                    main.gameUpdata();
                }
                this.hide();
            })
        }
        this.show();
    }


    public show(): void {
        this.node.active = true;
    }
    public hide(): void {
        this.node.active = false;
    }


}
