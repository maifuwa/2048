# 2048 (Vue 3 + Vite + TypeScript)

一个基于 Vue 3 的 2048 小游戏实现，支持键盘与触控滑动操作，并在本地持久化最高分。

## 功能

- 经典 2048 规则：移动、合并、随机生成新方块（`2`/`4`）
- 键盘操作：方向键 / `WASD`
- 触控/鼠标拖拽：基于 Pointer Events 识别滑动方向
- 胜利/失败状态提示，支持到达 2048 后继续游戏（Keep Playing）
- 最高分保存到 `localStorage`

## 开发与构建

依赖安装（二选一）：

```bash
bun install
# 或
npm install
```

启动开发服务器：

```bash
bun run dev
# 或
npm run dev
```

类型检查与构建：

```bash
bun run type-check
bun run build
```

本地预览：

```bash
bun run preview
```

## 使用的方法（实现要点）

- 状态模型：使用 `tiles: Tile[]` 表示棋盘（每个 tile 含 `row/col/value/id`），配合 `Map<"row,col", Tile>` 做位置索引（`src/game/engine.ts`）。
- 移动与合并：按方向将棋盘拆成若干条“线”（行/列，必要时反向遍历），逐格扫描并压缩到目标位置（`getLines`）。
- 合并规则：相邻且数值相同的 tile 在同一次移动中只合并一次（用 `prevMerged` 防止连续二次合并）；合并会生成新 tile（新 `id`，打上 `justMerged` 标记）并累计得分（`move`）。
- 随机生成：每次有效移动后在空位随机生成新 tile，`90%` 概率为 `2`，`10%` 为 `4`（`spawnRandomTile`）。
- 胜负判定：达到 `2048` 进入 `won`（未开启继续时）；无空位且相邻无法合并则 `lost`（`canMove`）。
- 动画/过渡标记：生成与合并会打上 `justSpawned/justMerged`，在下一帧用 `requestAnimationFrame` 清除，便于 CSS 动画触发（`src/composables/use2048Game.ts`、`src/components/Game2048/TileView.vue`）。
- 持久化：仅持久化最高分到 `localStorage`（`src/game/storage.ts`）。

## 目录结构

- `src/game/`：纯逻辑（状态、移动/合并、随机生成、胜负判定、存储）
- `src/composables/`：组合式封装（键盘监听、持久化、状态派生）
- `src/components/Game2048/`：界面组件（棋盘、方块、头部、胜负 overlay）
