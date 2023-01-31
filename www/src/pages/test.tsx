import React, { useState, memo, useEffect } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

export default function Page() {
  return <div>
    <SDK1 />
  </div>
}


const SDK1 = () => {
  const [selected, setSelected] = useState(0)

  const firstPart = `import { API } from "./sdk"

const updatedProduct = await API.product.update({ 
    body: {`

  const bodyName = `      name: "New name here"`
  const bodyId = `      id: 412`

  const endUpdateProduct = `    } 
})`

  const [updatedProduct, setUpdatedProduct] = useState(`updatedProduct.`)

  const bodySuggestions = [
    { name: "id", type: "number" },
    { name: "newName", type: "string" },
  ]

  const updatedProductSuggestions = [
    { name: "_id", type: "number" },
    { name: "name", type: "string" },
    {
      name: "object", type: "object", content: [
        { name: "content", type: "string" },
        { name: "content2", type: "string" }
      ]
    },
    { name: "stock", type: "number" },
    { name: "createdAt", type: "Date" },
    { name: "updatedAt", type: "Date" },
  ]

  const [code, setCode] = useState(firstPart)

  const features = [
    {
      icon: "/studio/send.svg",
      title: "Type-safe requests",
      desc: "Using Bridge is like using an SDK for your API's server code, giving you confidence in your endpoints."
    },
    {
      icon: "/studio/receive.svg",
      title: "Type-safe responses",
      desc: "Using Bridge is like using an SDK for your API's server code, giving you confidence in your endpoints."
    },
    {
      icon: "/studio/bug-icon.svg",
      title: "Easily handle incoming errors",
      desc: "Using Bridge is like using an SDK for your API's server code, giving you confidence in your endpoints."
    },
  ]

  return (
    <div className="py-24">
      <div className="flex flex-col justify-center items-cente max-w-6xl px-4 mx-auto">
        <img src="/studio/sdk-icon.svg" className="mb-4 w-64" />
        <h2 className="font-semibold text-4xl text-white text-center mx-auto w-3/4">Enhance your team’s productivity with the generated SDK</h2>
        <div className="grid grid-cols-2 gap-16 mt-24">
          <div className="bg-[#161616] bg-opacity-25 rounded-xl border border-white border-opacity-5">{features.map((el, index) => {
            return <div onClick={() => setSelected(index)} key={index} className={`p-6 border-b border-white border-opacity-5 last:border-none ${selected === index ? "bg-white bg-opacity-5" : ""}`}>
              <div className="flex gap-4">
                <img src={el.icon} className="w-10 self-start" />
                <div>
                  <h3 className="font-medium text-white text-lg">{el.title}</h3>
                  <p className="text-neutral-400 mt-2">{el.desc}</p>
                </div>
              </div>
            </div>
          })}</div>
          <div className="relative">

            <div className={`border bg-opacity-10 backdrop-blur-md bg-neutral-500 pb-32 text-sm border-white border-opacity-10 p-3 z-10 rounded-md`} style={{
            }}
            >

              <Code code={firstPart} show={true} maxHeight={24 * 4} />
              <Code code={bodyName} show={[1, 2].includes(selected)} />
              <Code code={bodyId} show={[1, 2].includes(selected)} />
              <Code code={endUpdateProduct} show={true} maxHeight={24 * 3} />
              <Code code={updatedProduct} show={selected === 2} maxHeight={300} suggestions={updatedProductSuggestions} />

            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

type SuggestionsType = Array<{
  name: string;
  type: string;
  content?: SuggestionsType
}>

const Code = ({ code, suggestions, show, maxHeight }: { code: string; show: boolean; maxHeight?: number; suggestions?: SuggestionsType }) => {

  const initialText = code

  const [text, setText] = useState("")
  const [isFinished, setIsFinished] = useState(false)
  const [tempSuggestions, setTempSuggestions] = useState<SuggestionsType | null>(suggestions)

  useEffect(() => {
    if (show) {
      let i = 0;

      setTimeout(() => {
        const intervalId = setInterval(() => {
          setText(initialText.slice(0, i));
          i++;
          if (i > initialText.length) {
            setIsFinished(true)
            clearInterval(intervalId);
          }
        }, 30);
        return () => clearInterval(intervalId);

      }, 150)
    }

  }, [initialText, show]);

  return (
    <Highlight {...defaultProps} code={text} language="tsx" theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className + " transition-all duration-700"} style={{
          ...style,
          background: 'transparent',
          paddingTop: 0,
          paddingBottom: 0,
          maxHeight: show ? maxHeight ? maxHeight : 24 : 0,
          opacity: show ? 1 : 0,
          height: suggestions ? 300 : 'auto'
        }}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })} style={{
              width: suggestions ? 'fit-content' : '',
              position: 'relative'
            }}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}

              {tempSuggestions &&
                <div className={`transition-all border right-0 translate-x-full max-w-max absolute border-white rounded-md border-opacity-10 bg-neutral-700 bg-opacity-5 backdrop-blur-sm
${show ? "opacity-100 delay-1000" : "opacity-0"}
`}
                >
                  {tempSuggestions.map((el, index) => {
                    return (
                      <div className='flex bg-white bg-opacity-0 hover:bg-opacity-5 transition-all gap-8 justify-between py-1.5 px-3 border-b border-white border-opacity-10' key={el.name} onClick={() => {
                        if (el.content && el?.content.length > 0) {
                          setTempSuggestions(el.content)
                        } else {
                          setTempSuggestions(null)
                        }
                        setText(text + el.name)
                      }}>
                        <div className='text-sm'>{el.name}</div>
                        <div className='text-sm text-neutral-400'>{el.type}</div>
                      </div>
                    )
                  })}
                </div>
              }

            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
