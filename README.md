# React Jotai Text

- https://jotai.org/docs/introduction
- https://tutorial.jotai.org/examples/textLenght

## atom

- atom 也就是 atom config 是一个不可变对象的定义, 不保存值，值存在 store 中
- 创建一个 primitive atom 的时候，只需要一个初始值
- 或是传入 getter 和 setter 函数派生出一个 atom
- get 是反应式的，并且会自动追踪读取依赖

```ts
const priceAtom = atom(10)
const messageAtom = atom('hello')
const productAtom = atom({ id: 12, name: 'good stuff' })

const readOnlyAtom = atom((get) => get(priceAtom) * 2)

const writeOnlyAtom = atom(null, (get, set, update) => {
  // update 是我们接收的任意单个值
  set(priceAtom, get(priceAtom) - update.discount)
  // 或者传递一个函数作为第二个参数，函数会接收到 atom 的当前值作为第一个参数
  set(priceAtom, (price) => price - update.discount)
})

const readWriteAtom = atom(
  (get) => get(priceAtom) * 2,
  (get, set, newPrice) => {
    set(priceAtom, newPrice / 2)
    // 可以同一时间更新任意多个 atom
  },
)
```

- atom 可以在任何地方创建，但引用相等性很重要
- 在渲染函数中，使用 `useMemo` 得到一个稳定的饮用

```tsx
const Component = ({ value }) => {
  const valueAtom = useMemo(() => atom({ value }), [value])
  // ...
}
```

- 类型

```ts
const primitiveAtom = atom(initialValue)
const derivedAtomWithRead = atom(read)
const derivedAtomWithReadWrite = atom(read, write)
const derivedAtomWithWriteOnly = atom(null, write)

// primitive atom
function atom<Value>(initialValue: Value): PrimitiveAtom<Value>

// read-only atom
function atom<Value>(read: (get: Getter) => Value): Atom<Value>

// writable derived atom
function atom<Value, Args extends unknown[], Result>(
  read: (get: Getter) => Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>

// write-only derived atom
function atom<Value, Args extends unknown[], Result>(
  read: Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>
```

## useAtom

- 通过 `useAtom` 使用 atom 后，初始值才会存在状态中
- 当一个 atom 不再被使用时，意味着使用它的所有组件都被卸载，并且原子配置不再存在，状态中的值将被垃圾回收
- `setValue` 只接受一个参数，也就是 setter 写入函数的第三个参数
- `useAtomValue` 和 `useSetAtom`

```tsx
const [value, setValue] = useAtom(anAtom)
```

```tsx
const countAtom = atom(0)

const Counter = () => {
  const setCount = useSetAtom(countAtom)
  const count = useAtomValue(countAtom)

  return <div>...</div>
}
```

## Store

- `createStore` 创建一个空存储，可以传入 `Provider`
- provider-less 时，可以使用 `getDefaultStore()` 获取默认的 store

```tsx
const myStore = createStore()

const countAtom = atom(0)
myStore.set(countAtom, 1)

const unsub = myStore.sub(countAtom, () => {
  console.log('countAtom value is changed to', myStore.get(countAtom))
})
// unsub() to unsubscribe

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
```

## Provider

- `Provider` 组件用于为组件子树提供状态
- 多个提供程序可用于多个子树，甚至可以嵌套，就像 React Context 一样工作
- 如果在没有 Provider 的树中使用 atom，它将使用默认状态，也就是 provider-less

```tsx
const myStore = createStore()

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)

// .....

const Component = () => {
  const store = useStore()
  // ...
}
```
