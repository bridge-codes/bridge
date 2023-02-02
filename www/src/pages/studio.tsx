import Layout from "@theme/Layout"
import React, { useState, useEffect } from "react"

export default function Page() {
  return <Layout>
    <div className="bg-[#010101] overflow-hidden">
      <div className="relative bg-[#010101] bg-contain bg-no-repeat" style={{ backgroundImage: `url("/studio/main.svg")` }} >

        <img src="/studio/lights.svg" className="no-select z-10 absolute top-0 w-screen animate-pulse" style={{ animationDuration: "4s" }} />
        <img src="/studio/lights.svg" className="no-select translate-x-64 z-10 absolute top-0 w-screen " style={{ animationDuration: "4s" }} />

        <div className="px-4 max-w-6xl mx-auto relative md:py-48 pt-24 pb-8">
          <div className="md:w-3/4 mx-auto">
            <h1 className="text-center text-indigo-400">Bridge Studio</h1>
            <p className="font-bold md:text-5xl text-4xl text-white text-center md:px-12 px-8">A new way to enhance your team’s productivity</p>
            <p className="text-center mt-6 text-[#808080] text-lg md:px-24 px-8">Bridge can generate a fully typed client code in a matter of seconds. Log with Github or use the CLI to sync your project with Studio.</p>
          </div>
          <img src="/studio/studio-header.svg" className="mt-24 no-select mx-auto" />
          {/* <div className="mt-16 grid grid-cols-2 gap-32 mb-16"> */}
          {/*   <CustomCard icon={<CodeBracketIcon className="w-5 h-5 text-white" />} title="SDK generation" description="Improve your developer productivity by generating an SDK" /> */}
          {/*   <CustomCard icon={<BookOpenIcon className="w-5 h-5 text-white" />} title="Documentation generation" description="Improve your developer productivity by generating an SDK" /> */}
          {/* </div> */}
        </div>
      </div>
      <Documentation />
      <SDK1 />
      <SDKPresentation />

    </div>
  </Layout>
}

const Documentation = () => {
  return (
    <div className="md:py-24 py-12">
      <div className="flex flex-col justify-center items-center max-w-6xl px-4 mx-auto">
        <img src="/studio/documentation-logo.svg" className="mb-4 w-20" />
        <h2 className="font-semibold text-3xl md:text-4xl text-white text-center md:px-12 px-8">Have an auto-generated documentation without writing any metadata.</h2>
        <img src="/studio/doc.svg" className="rounded-xl border border-white border-opacity-10 mt-16" />
        <div className="grid grid-cols-12 md:gap-9 gap-4 md:mt-9 mt-6">
          <GitHubIntegration />
          <Team />
        </div>
        <div className="mx-auto mt-12">
          <ContinueWithGithubButton />
        </div>
      </div>
    </div>
  )
}

const SDK1 = () => {
  const [selected, setSelected] = useState(0)

  const features = [
    {
      icon: "/studio/send.svg",
      title: "Type-safe requests",
      desc: "Using Bridge is like using an SDK for your API's server code, giving you confidence in your endpoints."
    },
    {
      icon: "/studio/receive.svg",
      title: "Type-safe responses",
      desc: "The SDK provides powerful autocompletion that improves the productivity of your frontend team."
    },
    {
      icon: "/studio/bug-icon.svg",
      title: "Easily handle incoming errors",
      desc: "Easily handle all incoming errors"
    },
  ]

  return (
    <div className="pb-24">
      <div className="flex flex-col justify-center items-center max-w-6xl px-4 mx-auto">
        <img src="/studio/sdk-icon.svg" className="mb-4 w-64" />
        <h2 className="font-semibold text-3xl md:text-4xl text-white text-center mx-auto md:w-3/4">Enhance your team’s productivity with the generated SDK</h2>
        <div className="grid md:grid-cols-2 md:gap-16 gap-6 md:mt-24 mt-12">
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
          <div className="self-center">
            {selected === 0 && <div className="relative">
              <img src="/studio/input-autocompletion.svg" />
              <div className="absolute border border-white border-opacity-10 " style={{ bottom: '10%', left: '22%' }}>
              </div>
            </div>}
            {selected === 1 && <div className="relative">
              <img src="/studio/auto-completion.svg" />
              <div className="absolute border border-white border-opacity-10 " style={{ bottom: '10%', left: '22%' }}>
              </div>
            </div>}
            {selected === 2 && <div className="relative">
              <img src="/studio/error-handling.svg" />
              <div className="absolute border border-white border-opacity-10 " style={{ bottom: '10%', left: '22%' }}>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}


type CustomCardType = {
  icon: JSX.Element;
  title: string;
  description: string;
}

const CustomCard = (props: CustomCardType) => {
  return (<div className="relative rounded-md border border-white border-opacity-5 overflow-hidden">
    <div className="p-8">
      <div className="flex gap-2 items-center">
        {props.icon}
        <h3 className="text-white font-medium text-lg">{props.title}</h3>
      </div>
      <p className="text-neutral-400">{props.description}</p>
    </div>
    <img src="/studio/customcard.svg" style={{ objectFit: 'fill' }} className="absolute inset-0 -z-10 w-full" />
  </div>)
}


const SDKPresentation = () => {
  return (
    <div className="py-24 bg-[#010101]">
      <div className="mx-auto max-w-6xl px-4 relative">
        <h2 className="text-center font-semibold text-4xl text-white">Never write HTTP requests again</h2>
        <p className="text-lg text-neutral-500 text-center"> Use your server's route like functions. </p>
        <div className="grid grid-cols-12 gap-8 mt-16">
          <PostmanCard />
          <MaintainCard />
        </div>
        <div className="mt-8 relative z-10">
          <LanguageCard />
        </div>
        <div className="max-w-max mx-auto mt-12 relative pb-24 z-10">
          <ContinueWithGithubButton />
        </div>
        <img src="/img/bg-lines.png" className="absolute -bottom-1/4 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  )
}

const LanguageCard = () => {
  return (
    <div className="border border-white border-opacity-10 bg-[#1B1A1C] bg-opacity-25 rounded-xl grid md:grid-cols-2 backdrop-blur-sm">
      <div className="px-8 py-8">
        <h3 className="text-white font-medium text-2xl">Made for many different languages</h3>
        <p className="text-base text-neutral-500">
          Generate SDK’s in many different languages for your apps or microservices.
          Currently only Typescript is supported.
        </p>
      </div>
      <img src="/studio/all-languages.svg" className="w-full h-full" />
    </div>
  )
}

const MaintainCard = () => {
  const [loading, setLoading] = useState(false)
  const initialText = "npx fetch-bridge-sdk bridecodes/server"
  const [text, setText] = useState("")

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setText(initialText.slice(0, i));
      i++;
      if (i > initialText.length) {
        clearInterval(intervalId);
        setLoading(true)
      }
    }, 40);
    return () => clearInterval(intervalId);
  }, [initialText]);

  return (
    <div className="border border-white border-opacity-10 bg-[#1B1A1C] bg-opacity-25 rounded-xl col-span-12 md:col-span-7 flex flex-col justify-between">
      <div className="py-8 px-8">
        <h3 className="text-white font-medium text-2xl text-center">Easily maintain and update your code</h3>
        <p className="text-base text-neutral-500 text-center px-8">
          After an update, the IDE alerts developers of changes that happened in the API, and identifies where changes need to be made in the code.
        </p>
      </div>
      <div className="px-8 flex gap-4 items-center mt-auto">
        <div className="relative w-full" onClick={() => setLoading(!loading)}>
          <div className={`border flex-1 border-white flex-grow border-opacity-10 w-full rounded-md px-6 py-3 text-sm bg bg-white bg-opacity-5 ${loading ? "animate-pulse" : ""}`} style={{
            fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
          }}>
            <span className="text-yellow-500">{text.slice(0, Math.min(3, text.length))}</span>
            {text.slice(3, Math.max(3, text.length))}
            <span className={`font-black text-base animate-pulse ${text.length === initialText.length ? "hidden" : ""}`}>|</span>
          </div>
        </div>
        <div className="h-6 w-6 relative flex items-center justify-center" style={{ minWidth: 24, minHeight: 24 }}>

          <svg className={`animate-spin transition-all h-6 w-6 text-white transition-all duration-500 ${loading ? "opacity-100" : "opacity-0"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`absolute inset-0 w-6 h-6 transition-all duration-700
${loading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
`}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM17.5607 10.0607C18.1464 9.47487 18.1464 8.52513 17.5607 7.93934C16.9749 7.35355 16.0251 7.35355 15.4393 7.93934L10.5 12.8787L8.56066 10.9393C7.97487 10.3536 7.02513 10.3536 6.43934 10.9393C5.85355 11.5251 5.85355 12.4749 6.43934 13.0607L9.43934 16.0607C10.0251 16.6464 10.9749 16.6464 11.5607 16.0607L17.5607 10.0607Z" fill="white" />
          </svg>

        </div>
      </div>

      <div className="px-8 mt-4 relative">
        <img src="/studio/fetch-code.svg" className="w-full" />
        <img src="/studio/dots.svg" className={`absolute transition-all duration-1000 delay-300 bottom-0 ${loading ? "opacity-0 translate-y-4" : "translate-y-0 opacity-100"}`} style={{ left: "14.4%", bottom: "24.8%", width: '28,57%' }} />
      </div>

    </div>
  )
}

const PostmanCard = () => {
  return (
    <div className="border border-white border-opacity-10 bg-[#1B1A1C] bg-opacity-25 rounded-xl md:col-span-5 col-span-12">
      <div className="py-8 px-8">
        <h3 className="text-white font-medium text-2xl text-center">Goodbye Postman collections</h3>
        <p className="text-base text-neutral-500 text-center px-8">
          The SDK contains all the informations necessary to integrate and use correctly your API.
        </p>
      </div>
      <img src="/studio/postman-img.svg" className="w-full border-top border-white border-opacity-10" />
    </div>
  )
}

const Team = () => {
  return (
    <div className="border border-white border-opacity-10 bg-[#1B1A1C] bg-opacity-25 rounded-xl md:col-span-7 col-span-12">
      <div className="py-8 px-8">
        <h3 className="text-white font-medium text-2xl">For your team and your users</h3>
        <p className="text-base text-neutral-500">
          You can have an easily maintainable documentation for both your users and your team.
        </p>
      </div>
      <img src="/studio/team.svg" className="" />
    </div>
  )
}

const GitHubIntegration = () => {
  return (
    <div className="border border-white border-opacity-10 bg-[#1B1A1C] bg-opacity-25 rounded-xl md:col-span-5 col-span-12">
      <div className="py-8 px-8">
        <h3 className="text-white font-medium text-2xl">GitHub integration</h3>
        <p className="text-base text-neutral-500">
          Keep your documentation up-to-date with your git repo.
        </p>
      </div>
      <img src="/studio/github-integration.svg" className="" />
    </div>
  )
}

const ContinueWithGithubButton = () => {
  return (
    <a href="https://api-prod.bridge.codes/auth/github" className="group">
      <button className="p-0.5 rounded-md" style={{ background: `linear-gradient(263.08deg, #75E0A2 0%, rgba(117, 224, 162, 0.25) 21.88%, rgba(117, 224, 162, 0.9) 42.71%, rgba(244, 248, 92, 0.3) 65.1%, rgba(244, 248, 92, 0.9) 84.38%, rgba(244, 248, 92, 0.25) 100%)`, boxShadow: `0px 25px 78px 18px rgba(204, 237, 0, 0.08)` }}>
        <div className="gap-3 bg-[#010101] hover:bg-opacity-95 transition-all bg-opacity-100 flex items-center justify-center px-12 py-3" style={{ borderRadius: 6 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white text-opacity-80 hover:text-opacity-100 transition-all">
            <path d="M9.99993 0C7.62546 0 5.32845 0.845241 3.51995 2.38385C1.71149 3.92246 0.509516 6.0547 0.129156 8.39843C-0.251203 10.7422 0.214845 13.1451 1.44393 15.1769C2.67299 17.2082 4.58487 18.7363 6.83747 19.4875C7.33749 19.5748 7.52499 19.2748 7.52499 19.0123C7.52499 18.775 7.51247 17.9875 7.51247 17.1501C4.99999 17.6125 4.35001 16.5374 4.14998 15.9749C3.92806 15.4277 3.57628 14.9432 3.12501 14.5626C2.77502 14.3751 2.275 13.9124 3.11248 13.9C3.43228 13.9345 3.73899 14.0459 4.00662 14.2244C4.27426 14.4029 4.49494 14.6433 4.65001 14.9249C4.78677 15.1705 4.97067 15.3869 5.19116 15.5612C5.4117 15.736 5.66445 15.8654 5.93501 15.9419C6.20557 16.0184 6.48858 16.0409 6.76784 16.0079C7.0471 15.9752 7.31713 15.8875 7.56246 15.7499C7.60573 15.2414 7.8323 14.7662 8.19995 14.4126C5.97498 14.1625 3.65 13.3 3.65 9.47504C3.63594 8.4813 4.00269 7.51943 4.67498 6.78744C4.36928 5.92382 4.40506 4.97583 4.77499 4.13771C4.77499 4.13771 5.61244 3.87522 7.52496 5.16258C9.16125 4.71258 10.8886 4.71258 12.5249 5.16258C14.4374 3.86247 15.2749 4.13771 15.2749 4.13771C15.6449 4.97583 15.6806 5.92382 15.3749 6.78744C16.0492 7.51831 16.4163 8.48093 16.3999 9.47504C16.3999 13.3124 14.0624 14.1625 11.8374 14.4126C12.0761 14.6545 12.2599 14.9447 12.3763 15.2639C12.4928 15.5834 12.5392 15.9239 12.5124 16.2625C12.5124 17.6001 12.4999 18.6748 12.4999 19.0123C12.4999 19.2748 12.6874 19.5876 13.1874 19.4875C15.436 18.7303 17.3424 17.1989 18.5663 15.166C19.7901 13.1331 20.2517 10.7317 19.8688 8.39017C19.4856 6.0487 18.2831 3.91946 16.4753 2.38273C14.6677 0.845613 12.3726 0.00112499 9.99993 0Z" fill="white" />
          </svg>
          <p className="group-hover:text-opacity-100 transition-all text-opacity-80 text-white font-medium"> Continue with GitHub</p>
        </div>
      </button>
    </a>
  )
}
