import type Agent from "./Agent";

export default class Selector {
  agents: Agent[] = [];

  addAgent = (agent: Agent) => {
    this.agents.push(agent);
  };

  getTotalScore = () => {
    return this.agents.reduce(
      (currentScore, currentAgent) => currentScore + currentAgent.score,
      0
    );
  };

  sortByScore = () => {
    this.agents = this.agents.sort((a: Agent, b: Agent) =>
      a.score > b.score ? 1 : a.score === b.score ? 0 : -1
    );
  };

  getSelectedAgent = () => {
    const totalScore = this.getTotalScore();
    const randomScore = Math.random() * totalScore;
    let currentScore = 0;
    for (const agent of this.agents) {
      currentScore += agent.score;
      if (currentScore >= randomScore) {
        return agent.position.x;
      }
    }
    return null;
  };
}
