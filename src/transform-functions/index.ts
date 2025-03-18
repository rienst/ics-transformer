export type TransformFn<T> = (arg: T) => T

export function transform<T>(
  input: T,
  transformers: TransformFn<T> | TransformFn<T>[]
): T {
  if (!Array.isArray(transformers)) {
    return transformers(input)
  }

  return transformers.reduce((acc, transformer) => transformer(acc), input)
}

export function transformMany<T>(
  input: T[],
  transformers: TransformFn<T> | TransformFn<T>[]
): T[] {
  return input.map(item => transform(item, transformers))
}
