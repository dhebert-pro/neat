import Neat from "@/model/neat/Neat";

export default class GameNeat {
  static NB_INPUTS: number = 18;
  static NB_OUTPUTS: number = 9;
  static NB_AGENTS: number = 20;

  static new = () => {
    return new Neat(
      GameNeat.NB_INPUTS,
      GameNeat.NB_OUTPUTS,
      GameNeat.NB_AGENTS
    );
  };
}
