export interface Measurable<T> {
  readonly tags: string[];
  readonly name: string;
  readonly type: string;
  readonly options: object;

  execute(): Promise<T>;
}