# 开源声明

## 物理引擎

本游戏使用 [tailuge/billiards](https://github.com/tailuge/billiards) 作为台球物理与渲染引擎。

- **许可证**: GNU General Public License v3.0 (GPL-3.0)
- **源码位置**: `vendor/tailuge-billiards/`
- **物理模型**: Han (2005) + Mathavan (2010) 论文模型，含高低杆、侧旋、库边动力学

## 中式八球规则扩展

在 `vendor/tailuge-billiards/src/controller/rules/chineseeightball.ts` 中实现，包括：

- 开球须先击打 1 号球
- 开球至少 4 球碰库或有球入袋
- 分花色后须先击打己方全色/花色球（任意一颗均可）
- 无入袋且无碰库判犯规

## 构建

```bash
./build.sh
python3 -m http.server 8765
# 打开 http://localhost:8765
```

## 操作说明

- **方向键**: 瞄准 / 高低杆 / 侧旋（Shift+左右）
- **空格**: 击球（按住蓄力）
- 本地双人对战：同一设备轮流击球，犯规后对方自由球
