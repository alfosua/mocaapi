import { useEffect, useState } from 'react'

function Saludo() {
  const [text, setText] = useState('Hola')

  useEffect(() => {
    fetch(`/api/hello?name=${new URLSearchParams(window.location.search).get('name') || 'World'}`)
      .then((res) => res.json())
      .then((data) => setText(data.text))
  }, [])

  return (
    <div>
      <h1>{text}</h1>
    </div>
  )
}
export default Saludo
