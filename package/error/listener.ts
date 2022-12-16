export type ErrorHandler = (p: {
  error: { status: number; data?: any; name: string };
  path: string;
}) => void;

type OnError = <T extends ErrorHandler>(p: T) => T;

export const onError: OnError = (p) => p;
