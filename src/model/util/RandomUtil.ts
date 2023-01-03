import ArrayUtil from "./ArrayUtil";

export default class RandomUtil {
  static getInt = (start: number, end: number) => {
    return start + Math.floor(Math.random() * (end + 1 - start));
  };

  static getElements = <T>(nbElements: number, list: T[]) => {
    const shuffledList: T[] = ArrayUtil.shuffle(list);
    return shuffledList.slice(0, nbElements);
  };

  static getElement = <T>(list: T[]) => {
    return list[RandomUtil.getInt(0, list.length - 1)];
  };
}
