import React from 'react'

export const NewsLetter = (): JSX.Element => {
  return (
    <div className="grid gap-4 bg-[#010101] pb-32 layout sm:gap-32 sm:grid-cols-3 section">
      <div className="sm:col-span-2">
        <h2 className="text-3xl font-semibold">
          Bridge is getting better every day — <br /> don’t miss out anything.
        </h2>
        <p className="mt-4 text-neutral-300">
          Join the Bridge newsletter and stay updated on new releases,
          features and guides. 
        </p>
      </div>

          <a href="https://discord.gg/yxjrwm7Bfr" target="_blank" className="self-center">
      <div className="self-center">
          <div
            className="max-w-md p-0.5 relative mx-auto bg-left-bottom hover:bg-right-bottom overflow-hidden rounded-md cursor-pointer group bg-grad2 transition-all hover:positio"
            style={{ backgroundSize: '300% 300%', transitionDuration: '2000ms' }}
          >
            <div
              className="py-3 text-center text-white rounded-sm bg-[#0D0B0E]"
            >
            Join our Discord
            </div>
          </div>
      </div>
          </a>
    </div>
  );
};
