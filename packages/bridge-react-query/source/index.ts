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
    { data: Exclude<TData, null>; error: null } | { data: null; error: Exclude<TError, null> },
    TQueryKey
  >,
  options?: Omit<
    UseQueryOptions<
      { data: Exclude<TData, null>; error: null } | { data: null; error: Exclude<TError, null> },
      TError,
      Exclude<TData, null>,
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
    { data: TData; error: null } | { data: null; error: TError },
    TVariables
  >,
  options?: Omit<
    UseMutationOptions<Exclude<TData, null>, TError, TVariables, TContext>,
    'mutationFn'
  >,
) =>
  useMutation(async (input: TVariables) => {
    const { data, error } = await mutationFn(input);
    if (error) throw error;
    return data as Exclude<TData, null>;
  }, options);

export * from '@tanstack/react-query';
export { useBridgeQuery, useBridgeMutation };
