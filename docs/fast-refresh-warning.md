# Fast Refresh 警告の原因と対処法

## 発生した警告メッセージ

```
Fast refresh only works when a file only exports components.
Move your component(s) to a separate file.
If all exports are HOCs, add them to the `extraHOCs` option.
```

## Fast Refresh とは

Reactの開発中に、コードを保存したらブラウザをリロードせずに画面が自動で更新される機能のこと。

```
コード保存 → Fast Refreshが変更を検知 → 画面に即反映
```

## Fast Refresh が動く条件

1つのファイルからは **Reactコンポーネントだけ** をエクスポートする必要がある。

```tsx
// OK: コンポーネントだけエクスポートしている
export const Button = () => <button>押して</button>
export const Card = () => <div>カード</div>
```

```tsx
// NG: コンポーネントと「コンポーネントじゃないもの」が混ざっている
export const Button = () => <button>押して</button>
export const maxCount = 10   // ← ただの数値でありコンポーネントではない
```

コンポーネントと非コンポーネントが混在すると、Fast Refreshは安全に部分更新できるか判断できないため、Fast Refreshを無効にして警告を出す。

## 今回の発生状況

カスタムレンダー（test-utils）ファイルで、コンポーネントと非コンポーネントが同じファイルからエクスポートされていたため発生した。

```tsx
// コンポーネント（JSXを返す関数）
const ChakraProviderWrapper = ({children}) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

// コンポーネントではないもの
export * from '@testing-library/react'   // screen, fireEvent 等
export {customRender as render}          // ただの関数
```

| エクスポート | コンポーネントか |
|---|---|
| ChakraProviderWrapper | はい（JSXを返す関数） |
| screen | いいえ（オブジェクト） |
| fireEvent | いいえ（関数） |
| render | いいえ（関数） |

## 影響範囲

- **エラーではなく警告**。アプリもテストも壊れない
- 唯一の影響: このファイルを編集したとき、Fast Refresh（ブラウザの自動更新）が効かなくなる
- テストの実行には一切影響しない

## 対処法

### 方法1: テストユーティリティを src 外に置く

```
project/
├── src/
│   └── ...
├── test/              ← src外に配置
│   └── test-utils.tsx
```

Viteは基本的に `src/` 配下を監視するため、外に出せば警告は消える。

### 方法2: ラッパーコンポーネントを別ファイルに分離する

```tsx
// src/test/providers.tsx（コンポーネントだけ）
import {ChakraProvider} from '@chakra-ui/react'

export const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return <ChakraProvider>{children}</ChakraProvider>
}
```

```tsx
// src/test/test-utils.ts（非コンポーネントだけ）
import {render, RenderOptions} from '@testing-library/react'
import {AllTheProviders} from './providers'

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}
```

## 参考

- [React Testing Library - Custom Render](https://testing-library.com/docs/react-testing-library/setup/#custom-render)
