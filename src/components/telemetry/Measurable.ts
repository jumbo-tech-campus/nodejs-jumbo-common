export interface Measurable<T> {
  readonly measurePrefix: string;
  readonly tags: string[];

  execute(): Promise<T>;
}