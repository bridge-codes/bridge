import {
  UseMutationOptions,
  useQuery,
  useMutation,
  UseQueryOptions,
  QueryKey,
  QueryFunction,
  MutationFunction,
} from '@tanstack/react-query';

const useBridgeQuery = <TData, TError, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<
    | { data: Exclude<TData, undefined>; error: undefined }
    | { data: undefined; error: Exclude<TError, undefined> },
    TQueryKey
  >,
  options?: Omit<
    UseQueryOptions<
      | { data: Exclude<TData, undefined>; error: undefined }
      | { data: undefined; error: Exclude<TError, undefined> },
      TError,
      Exclude<TData, undefined>,
      TQueryKey
    >,
    'queryKey' | 'queryFn' | 'initialData'
  > & {
    initialData?: () => undefined;
  },
) =>
  useQuery(
    queryKey,
    async (context) => {
      const { data, error } = await queryFn(context);
      if (error) throw error;
      return data as any;
    },
    options,
  );

const useBridgeMutation = <TData, TError, TVariables = void, TContext = any>(
  mutationFn: MutationFunction<
    { data: TData; error: undefined } | { data: undefined; error: TError },
    TVariables
  >,
  options?: Omit<
    UseMutationOptions<Exclude<TData, undefined>, TError, TVariables, TContext>,
    'mutationFn'
  >,
) =>
  useMutation(async (input: TVariables) => {
    const { data, error } = await mutationFn(input);
    if (error) throw error;
    return data as Exclude<TData, undefined>;
  }, options);

export * from '@tanstack/react-query';
export { useBridgeQuery, useBridgeMutation };
