export default class RandomSelector<T> {
  objects: T[] = [];
  scores: number[] = [];

  totalScore: number = 0;

  add = (element: T, score: number) => {
    this.objects.push(element);
    this.scores.push(score);
    this.totalScore += score;
  };

  random = () => {
    const v: number = Math.random() * this.totalScore;
    let c: number = 0;
    for (let i: number = 0; i < this.objects.length; i++) {
      c += this.scores[i];
      if (c >= v) {
        return this.objects[i];
      }
    }
    return null;
  };

  reset = () => {
    this.objects = [];
    this.scores = [];
    this.totalScore = 0;
  };
}
