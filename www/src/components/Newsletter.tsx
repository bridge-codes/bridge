import React from 'react'

export const NewsLetter = (): JSX.Element => {
  return (
    <div className="grid gap-4 pb-32 layout sm:gap-32 sm:grid-cols-3 section">
      <div className="sm:col-span-2">
        <h2 className="text-3xl font-semibold">
          Bridge is getting better every day — <br /> don’t miss out anything.
        </h2>
        <p className="mt-4 text-neutral-800 dark:text-neutral-300">
          Join the Bridge newsletter and stay updated on new releases,
          features and guides. 
        </p>
      </div>

      <div className="self-center">
        <form className="flex flex-col items-center">
          <input
            type="email"
            className="w-full px-3 py-2 mb-2 border border-gray-400 rounded-lg"
            placeholder="Your email address"
          />
          <button className="w-max-w py-3 text-sm font-semibold text-white rounded-lg bg-theme-main">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};
