export default class ArrayUtil {
  static shuffle = <T>(list: T[]) => {
    const result: T[] = [...list];
    result.sort(() => 0.5 - Math.random());
    return result;
  };

  static doubleMap = <T>(
    list: T[][],
    mapFunction: (value: T, index?: number, array?: T[]) => any
  ): T[][] => {
    return list.map((element: T[]) =>
      element.map((value: T, index: number, array: T[]) =>
        mapFunction(value, index, array)
      )
    );
  };

  static removeAtIndex = <T>(list: T[], index: number) => {
    list.splice(index, 1);
  };

  static remove = <T>(list: T[], element: T) => {
    const index = list.indexOf(element);
    ArrayUtil.removeAtIndex(list, index);
  };
}
