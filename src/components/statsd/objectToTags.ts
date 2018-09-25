export const objectToTags = (options: Record<string, any>): string[] => {
  let tags: string[] = [];

  for (let key of Object.keys(options)) {
    const value = options[key];

    if (typeof value === 'string' && !!value) {
      tags.push(`${key}:${value}`);
    } else if (['number', 'boolean'].includes(typeof value)) {
      tags.push(`${key}:${value}`);
    }
  }

  return tags;
};