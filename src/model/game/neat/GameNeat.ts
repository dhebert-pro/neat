import Neat from "@/model/neat/Neat";

const NB_INPUTS: number = 18;
const NB_OUTPUTS: number = 9;
const NB_AGENTS: number = 20;

const newNeat = () => new Neat(NB_INPUTS, NB_OUTPUTS, NB_AGENTS);

export default newNeat;
