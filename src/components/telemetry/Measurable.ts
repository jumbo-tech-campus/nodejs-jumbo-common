export interface Measurable<T> {
  readonly measurePrefix: string;
  readonly tags: string[];
  readonly name: string;
  readonly options: object;

  execute(): Promise<T>;
}