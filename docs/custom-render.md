# testing-library カスタム render パターン

## 背景

Chakra UI などの UI ライブラリは、コンポーネントが `Provider` で囲まれている必要がある。
テストで毎回 `<Provider><App /></Provider>` と書くのは面倒なので、testing-library 公式が推奨する **カスタム render パターン** を使う。

公式ドキュメント: https://testing-library.com/docs/react-testing-library/setup#custom-render

---

## 公式ドキュメントのコードリーディング

### test-utils.tsx の全体像

```tsx
import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {ThemeProvider} from 'my-ui-lib'
import {TranslationProvider} from 'my-i18n-lib'
import defaultStrings from 'i18n/en-x-default'

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider theme="light">
      <TranslationProvider messages={defaultStrings}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}
```

---

### 1. AllTheProviders コンポーネント

```tsx
const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider theme="light">
      <TranslationProvider messages={defaultStrings}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  )
}
```

テストで毎回囲みたい Provider をまとめたラッパーコンポーネント。
公式の例では `ThemeProvider` と `TranslationProvider` を使っているが、プロジェクトに応じて中身は変わる。

---

### 2. customRender 関数

```tsx
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})
```

各引数の役割:

| 引数 | 型 | 説明 |
|---|---|---|
| `ui` | `ReactElement` | テスト対象のコンポーネント。`<App />` など |
| `options` | `Omit<RenderOptions, 'wrapper'>` | `render` のオプション。`wrapper` だけ型から除外されている |

#### なぜ `Omit<RenderOptions, 'wrapper'>` なのか

`wrapper` は常に `AllTheProviders` を使うため、外から上書きされることを防いでいる。

#### `render(ui, {wrapper: AllTheProviders, ...options})` の動作

testing-library の `render` に `wrapper` オプションを渡すと、自動的に `<AllTheProviders>{ui}</AllTheProviders>` と囲んでくれる。
さらに `rerender` 時にも自動で Provider が適用されるのがこの方法の利点。

---

### 3. export の仕組み

```tsx
export * from '@testing-library/react'
export {customRender as render}
```

- **1行目**: `screen`、`fireEvent`、`waitFor` など testing-library の全 export をそのまま re-export
- **2行目**: `render` だけを自前の `customRender` で上書きして export

この仕組みにより、テスト側は **import 先を変えるだけ** で Provider 付きの render が使える:

```tsx
// before: Provider なし
import { render, screen } from '@testing-library/react'

// after: Provider 自動適用
import { render, screen } from './test-utils'
```

---

## このプロジェクトでの実装例

```tsx
// src/__tests__/test-utils.tsx
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from '@/components/ui/provider'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

テスト側の変更:

```tsx
// src/__tests__/AppComponent.spec.tsx
import { render, screen } from './test-utils'  // import 先を変更するだけ
import App from '../App'

describe("title", () => {
  it("should render title", () => {
    render(<App />)  // Provider で自動的に囲まれる
    expect(screen.getByText("Hello Nakajima")).toBeInTheDocument()
  })
})
```
