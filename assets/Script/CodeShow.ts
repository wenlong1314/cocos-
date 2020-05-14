import { _cdn2,  GameCode, post } from "./global";

import { prefabs } from "./prefabs";
import GMPage from "./GMPage";
import { main } from "./Main";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CodeShow extends cc.Component {

    private view: cc.Node;
    private content: cc.Node;
    public init(arrs: Array<GameCode>, gmPage: GMPage): void {
        console.log("init CodeShow");
        this.view = this.node.getChildByName("view");
        this.content = this.view.getChildByName("content");
        this.content.removeAllChildren();
        this.content.height = arrs.length * 60;
        for (let index in arrs) {
            let item: cc.Node = prefabs.instantiate("ScrollViewItem");
            let txt1 = item.getChildByName("txt1").getComponent(cc.EditBox);
            let txt2 = item.getChildByName("txt2").getComponent(cc.Label);
            let txt3 = item.getChildByName("txt3").getComponent(cc.Label);
            let btn = item.getChildByName("btn");
            txt1.string = arrs[index].code + "";
            txt2.string = arrs[index].info;
            txt3.string = arrs[index].times + "";
            item.y = - (index) * 60;
            this.content.addChild(item);
            btn.on(cc.Node.EventType.TOUCH_START, () => {
                console.log("删除");
                arrs.splice(Number.parseInt(index), 1);
                console.log(arrs)
                this.init(arrs, gmPage);
                post({ op: "removeCode", game: main.chooseGameID, code: arrs[index].code + "" }, rsp => {
                    if (rsp.success) {
                        alert("成功");
                    } else {
                        alert("失败");
                    }
                });
            })
            let oldString;
            txt1.node.on('editing-did-began', (evt: { target: cc.Node }) => {
                console.log("开始")
                oldString = txt1.string;
            });
            txt1.node.on('editing-did-ended', (evt: { target: cc.Node }) => {
                console.log("结束")
                txt1.string = oldString;
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
