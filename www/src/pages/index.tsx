import React, { useRef, useEffect, useState } from 'react';
import { Redirect } from '@docusaurus/router';
import Layout from '@theme/Layout';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code } from '../components/Code';
import { NewsLetter } from '../components/Newsletter';

export default function Home(): JSX.Element {
  return (
    <div>
      <Layout>
        <HeroSection />
        <div className="bg-[#010101] pb-32">
          <div className="relative layout">
            <img src="img/bg-lines.png" className="absolute z-0" />
            <Breadcrumb text="Simplicity" />
            <h2 className="w-3/4 mt-4 text-3xl font-semibold text-white md:text-5xl">
              <span className="grad">Bridge</span> offers an easy and scalable way to write your
              backend code.
            </h2>
            <FeaturesDemo />
          </div>
        </div>
        <Studio />
        <NewsLetter />
      </Layout>
    </div>
  );
  return <Redirect to="/docs/introduction" />;
}

const Studio = () => {
  return (
    <div className="bg-[#010101]">
      <div className="py-32 layout">
        <Breadcrumb text="Coming soon" />
        <h2 className="text-4xl mt-3 font-semibold text-white">
          Bridge <span className="grad">Studio</span>
        </h2>
        <p className="w-3/4  mt-4 text-lg text-white text-opacity-50 md:text-xl">
          Bridge aims to provide the best developer experience ever by simplifying the process of
          developing and integrating APIs.
        </p>
        <Code />
        <h2 className="text-4xl mt-3 font-semibold text-white mt-32 text-center">
          Your <span className="grad">API documentation</span> in one click
        </h2>
        <p className="w-3/4 mx-auto mt-6 text-lg text-center text-white text-opacity-50 md:text-xl">
          Bridge can generate a clear and concise API reference in a matter of seconds.
        </p>
        <img src="/img/dashboard.png" className="mt-12 rounded-md" />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [copied, setCopied] = useState(false);
  const copyCommand = () => {
    navigator.clipboard.writeText('npx create-bridge-app').then(() => {
      setCopied(true);
    });
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  return (
    <div className="bg-[#010101]">
      <div className="relative min-h-screen" style={{ backgroundImage: `url("/img/bg.png")` }}>
        <div className="relative z-20 py-20 md:py-48 layout">
          {/* <div className="max-w-max mx-auto mt-2 mb-4">
            <Breadcrumb text="Focus On Developer Experience" />
          </div> */}

          <h1 className="text-4xl font-semibold text-center text-white md:text-6xl">
            The <span className="grad">Typescript</span> API framework that enhances developer{' '}
            <span className="grad">productivity</span>
          </h1>
          <p className="w-3/4 mx-auto mt-8 text-lg text-center text-white text-opacity-50 md:text-xl">
            Bridge aims to provide the best developer experience ever by simplifying the process of
            developing and integrating APIs.
          </p>
          <div
            onClick={() => copyCommand()}
            className="max-w-md p-0.5 relative mx-auto mt-20 bg-left-bottom hover:bg-right-bottom overflow-hidden rounded-md cursor-pointer group bg-grad2 transition-all hover:positio"
            style={{ backgroundSize: '300% 300%', transitionDuration: '2000ms' }}
          >
            <div
              className="py-3 text-center text-white rounded-sm bg-[#0D0B0E]"
              style={{ fontFamily: 'Fira Code' }}
            >
              ~ npx create-bridge-app
            </div>
            <div className="absolute p-1.5 text-white bg-white bg-opacity-0 -translate-y-1/2 border border-white hover:bg-opacity-20 border-opacity-0 rounded-md opacity-50 group-hover:border-opacity-20 hover:opacity-75 right-3 top-1/2">
              {copied ? (
                <div className="text-xs uppercase">copied</div>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3C8 2.44772 8.44772 2 9 2H11C11.5523 2 12 2.44772 12 3C12 3.55228 11.5523 4 11 4H9C8.44772 4 8 3.55228 8 3Z"
                    fill="white"
                  />
                  <path
                    d="M6 3C4.89543 3 4 3.89543 4 5V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V5C16 3.89543 15.1046 3 14 3C14 4.65685 12.6569 6 11 6H9C7.34315 6 6 4.65685 6 3Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <img src="/img/globe-bottom.svg" className="absolute bottom-0 z-0 w-full" />
        <img src="/img/globe.png" className="absolute right-0 z-10 w-64 bottom-32" />
        <img src="/img/bg-lines.png" className="absolute z-10 -translate-x-1/2 -top-24 left-1/2" />
      </div>
    </div>
  );
};

const Breadcrumb = ({ text }: { text: string }) => {
  return (
    <div
      className="px-6 py-2 text-xs text-white uppercase bg-white border border-white rounded-full max-w-max border-opacity-10 bg bg-opacity-5"
      style={{ letterSpacing: 1.04 }}
    >
      {text}
    </div>
  );
};

const FeaturesDemo = () => {
  const [selected, setSelected] = useState(0);
  const codeStringFirst = `import { initBridge, handler, apply } from 'bridge';
import { z } from "zod"`;

  const codeStringLast = `const bridge = initBridge({ routes: { hello } });

bridge.HTTPServer().listen(8080, () => {
    "Listening on port 8080";
});`;

  // base
  const codeString1 = `const hello = handler({`;
  const codeString4 = `   resolve: () => "Hello you !"`;
  const codeString5 = `})`;

  // data validation
  const bodyHandlerLine = `   body: z.object({ age: z.number().min(0).max(200) }),`;
  const codeString22 = `   query: z.object({ name: z.string() }),`;

  // experience typescript inference
  const codeStringExperience = `   resolve: (data) => "Hello" + data.query.name`;
  const inner = `(parameter) data: {
  body: {
      age: number;
  };
  query: {
      name: string;
  };
}`;

  // middleware
  const addMiddlewareLine = `   middlewares: apply(ageVerificationMid),`;
  const codeMiddleware = `const ageVerficationMid = handler({
    body: z.object({
        age: z.number().min(0).max(200),
    }),
    resolve: ({ body }) => {
        if (body.age < 18) return {
            type: "minor"
        } as const
        else return {
            type: "major"
        } as const
    }
})`;

  return (
    <div className="relative grid mt-16 md:grid-cols-2">
      <div className="flex gap-4 mb-6 overflow-x-auto md:flex-col md:mb-0">
        <FeatureElement
          selected={selected === 0}
          setSelected={setSelected}
          index={0}
          title="Create an endpoint"
          text="An intuitive way to write and to manage your endpoints."
          icon=""
        />

        <FeatureElement
          selected={selected === 1}
          setSelected={setSelected}
          index={1}
          title="Validate your data"
          text="Bridge supports query, body and headers validation using zod, yup or superstruct."
          icon=""
        />

        <FeatureElement
          selected={selected === 2}
          setSelected={setSelected}
          index={2}
          title="Experience the power of Typescript"
          text="Catch error ahead of time and improve your productivity using IDE’s autocompletion."
          icon=""
        />

        <FeatureElement
          selected={selected === 3}
          setSelected={setSelected}
          index={3}
          title="Add middlewares"
          text="Create powerful type-safe middlewares that can validate data, and pass data to next middlewares."
          icon=""
        />
      </div>
      <div className="bg-[#0D0D11] overflow-x-auto bg-opacity-75 border border-[#14181D] rounded-md">
        <div className="w-full border-b border-[#14181D]">
          <div className="px-6 items-center flex gap-2 py-1.5 text-sm text-opacity-75 border-b-2 bg-white bg-opacity-5 max-w-max border-[#8690EA] text-[#CCCDF0]">
            <svg
              className="w-3.5 h-3.5 opacity-75"
              fill="none"
              height="26"
              viewBox="0 0 27 26"
              width="27"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z"
                fill="#3178C6"
                fill-rule="evenodd"
              ></path>
            </svg>
            index.ts
          </div>
        </div>
        {/* CODE */}
        <div className="pt-5 pb-10 overflow-y-hidden text-sm">
          <CustomCode codeString={codeStringFirst} display={true} />
          <CustomCode
            codeString={codeMiddleware}
            display={selected >= 3}
            delay={0}
            marginTop={16}
            maxHeight={300}
            highlight={selected === 3}
          />
          <CustomCode
            codeString={codeString1}
            display={selected >= 0}
            marginTop={16}
            highlight={selected === 0}
          />
          <CustomCode
            codeString={bodyHandlerLine}
            display={[1, 2].includes(selected)}
            highlight={selected === 1}
          />
          <CustomCode
            codeString={codeString22}
            delay={700}
            display={selected >= 1}
            highlight={selected === 1}
          />
          <CustomCode
            codeString={addMiddlewareLine}
            display={selected >= 3}
            delay={1000}
            highlight={selected === 3}
          />
          <CustomCode
            codeString={codeString4}
            display={selected >= 0 && selected < 2}
            highlight={selected === 0}
            maxHeight={22}
          />
          <div className={`relative ${selected === 2 ? 'block' : 'block'}`}>
            <div
              className={`absolute transition-all bg-black p-3 z-10 rounded-md border border-white border-opacity-10 shadow-2xl top-6 left-32 text-sm text-white ${
                selected === 2
                  ? 'opacity-100 delay-500 duration-500'
                  : 'opacity-0 delay-75 duration-150'
              }`}
            >
              <CustomInner codeString={inner} display={true} />
            </div>
            <CustomCode
              codeString={codeStringExperience}
              display={selected >= 2}
              maxHeight={22}
              highlight={selected === 2}
            />
          </div>
          <CustomCode
            codeString={codeString5}
            display={selected >= 0}
            maxHeight={25}
            highlight={selected === 0}
          />
          <CustomCode codeString={codeStringLast} display={true} marginTop={16} maxHeight={500} />
        </div>
      </div>
    </div>
  );
};

const CustomInner = ({
  display,
  codeString,
  marginTop,
  maxHeight,
  highlight,
  animationDelay,
}: {
  marginTop?: number;
  display: boolean;
  codeString: string;
  maxHeight?: number;
  highlight?: boolean;
  animationDelay?: number;
}) => {
  return (
    <div
      className="flex items-center overflow-hidden text-xs transition-all duration-700 ease-in-out"
      style={{
        maxHeight: display ? (maxHeight ? maxHeight : 320) : 0,
        opacity: display ? 1 : 0,
        borderLeftColor: highlight ? '#C792EA' : 'rgb(0,0,0,0)',
        borderStyle: 'solid',
      }}
    >
      <SyntaxHighlighter
        language="typescript"
        style={nord}
        customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const CustomCode = ({
  display,
  codeString,
  marginTop,
  maxHeight,
  highlight,
  delay,
}: {
  marginTop?: number;
  display: boolean;
  codeString: string;
  maxHeight?: number;
  delay?: number;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`md:px-5 px-3 overflow-hidden transition-all duration-700 ease-in-out ${
        display ? 'md:flex inline-flex' : 'block'
      }`}
      style={{
        maxHeight: display ? (maxHeight ? maxHeight : 100) : 0,
        opacity: display ? (highlight ? 1 : 0.85) : 0,
        marginTop: display ? marginTop | 0 : 0,
        borderLeft: 2,
        borderLeftColor: highlight ? '#C792EA' : 'rgb(0,0,0,0)',
        borderStyle: 'solid',
        background: highlight ? 'rgb(255,255,255,0.04)' : 'rgb(255,255,255,0)',
        padding: highlight ? '0px 20px' : '0px 20px',
        transitionDelay: highlight ? (delay ? delay.toString() + 'ms' : '0ms') : '0ms',
        willChange: 'max-height',
      }}
    >
      <SyntaxHighlighter
        language="typescript"
        style={nord}
        customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const FeatureElement = ({
  selected,
  icon,
  title,
  text,
  index,
  setSelected,
}: {
  selected: boolean;
  icon: string;
  title: string;
  text: string;
  index: number;
  setSelected: any;
}) => {
  const thisElement = useRef<HTMLDivElement>(null);
  return (
    <div className="flex items-center" ref={thisElement}>
      <div
        onClick={() => {
          setSelected(index);
          const size = thisElement.current.getClientRects();
          console.log(size);
        }}
        className={`rounded-md flex w-max max-w-xs w-full transition-all border cursor-pointer bg-white md:p-5 p-2 ${
          selected
            ? 'border-t-main bg-opacity-5'
            : 'border-white border-opacity-10 hover:bg-opacity-5 bg-opacity-0'
        }`}
      >
        <div>
          <img src={icon} />{' '}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white md:text-lg">{title}</h3>
          <p className="hidden mt-2 text-sm text-white text-opacity-75 md:block">{text}</p>
        </div>
      </div>
      <div
        className="hidden transition-all duration-1000 delay-300 md:block"
        style={{
          background: selected
            ? 'linear-gradient(90deg, #8690EA 0%, rgba(134, 144, 234, 0) 100%)'
            : 'rgb(255,255,255,0)',
          height: 2,
          width: '50%',
          opacity: selected ? 1 : 0,
        }}
      ></div>
    </div>
  );
};
