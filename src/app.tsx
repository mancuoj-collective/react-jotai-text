import { atom, useAtom, useAtomValue } from 'jotai'

const textAtom = atom('hello')
const uppercaseAtom = atom((get) => get(textAtom).toUpperCase())
const textLengthAtom = atom((get) => get(textAtom).length)

function Input() {
  const [text, setText] = useAtom(textAtom)
  return <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
}

function Uppercase() {
  const text = useAtomValue(uppercaseAtom)
  return <p>{text}</p>
}

function Length() {
  const length = useAtomValue(textLengthAtom)
  return <p className="length">{length}</p>
}

export default function App() {
  return (
    <div className="app">
      <div className="container">
        <Length />
        <Input />
        <Uppercase />
      </div>
    </div>
  )
}
