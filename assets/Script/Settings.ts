export default interface Settings {
    系统配置版本: string;
    初始金币: number;
    初始钻石: number;
    初始体力: number;

    客服签到领钻石个数: number;
    客服签到领钻石图标: string;
    每邀请一位好友获得钻石个数: number;
    胜利宝箱倍数: number;
    多少关之前不出分享: number;
    多少关之前不出连点宝箱: number;
    误触关: boolean;
    误触白名单: Array<number>;
    误触白名单1: Array<number>;
    路径: string;
    误触白名单2: Array<number>;
    分享关: boolean;
    分享白名单: Array<number>;
    CPA关: boolean;
    CPA黑名单: Array<number>;
    更新提示: string;
    分享必须N秒以上: number;
    分享失败提示: string;
    视频已用尽: string;
    微信合成点击完毕出现Banner: Array<number>;
    游戏左下角Banner显示概率: number;
    a: boolean;
    分享们b: Array<Share>;
}

export interface Share {
    rate?: number;
    title?: string;
    imageUrl?: string;
    query?: string;
    urlBase64?: string;
}
