import {Dictionary} from '../helpers/Dictionary';

export const objectToTags = (options: Dictionary<any>): string[] => {
  let tags: string[] = [];

  for (let key of Object.keys(options)) {
    const value = options[key];

    if (['number', 'string', 'boolean'].includes(typeof value)) {
      tags.push(`${key}:${value}`);
    }
  }

  return tags;
};