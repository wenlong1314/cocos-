export namespace prefabs {

    export const names: Array<string> = new Array();
    export const s: { [key: string]: cc.Prefab } = {};

    export function init(onComplete: () => void): void {

        cc.loader.loadResDir("prefabs/", cc.Prefab, (error: any, prefabs: Array<cc.Prefab>) => {
            for (let prefab of prefabs) {
                if (s[prefab.data.name]) {
                    console.error("重复名字的 prefab：" + prefab.data.name);
                } else {
                    names.push(prefab.data.name);
                    s[prefab.data.name] = prefab;
                }
            }
            if (onComplete) {
                onComplete();
            }
        });
    }

    export function has(name: string): boolean {
        return s[name] ? true : false;
    }

    export function instantiate(name: string): cc.Node {
        let prefab: cc.Prefab = s[name];
        if (prefab) {
            return cc.instantiate(prefab);
        }
        console.error("木有Prefab：" + name);
        return null;
    }

}
