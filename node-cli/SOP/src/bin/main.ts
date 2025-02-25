import prompts from "prompts";
import { EKSSOP } from "../services/eks";
import { RedpandaSOP } from "../services/redpanda";

enum Action {
  EKSUsage = "EKS_USAGE",
  RedpandaLag = "REDPANDA_TOPIC_LAG",
  SOP = "SOP",
}

const { action } = await prompts({
  type: "select",
  name: "action",
  message: "What do you want to do?",
  choices: [
    { title: "calculate EKS usage", value: Action.EKSUsage },
    { title: "redpanda topic lag", value: Action.RedpandaLag },
    { title: "generate sop", value: Action.SOP },
  ],
});

if (action === Action.EKSUsage) {
  const eksSOP = new EKSSOP();

  const data = eksSOP.getEKSCalculatedData();

  console.log(data);
}

if (action === Action.RedpandaLag) {
  const redpandaSOP = new RedpandaSOP();

  const data = redpandaSOP.getRedpandaLagData();

  console.log(data);
}

if (action === Action.SOP) {
  const redpandaSOP = new RedpandaSOP();
  const eksSOP = new EKSSOP();

  const eksData = eksSOP.getEKSCalculatedData();
  const redpandaLagData = redpandaSOP.getRedpandaLagData();

  console.log("------------------------------EKS USAGE-----------------------------\n");
  console.log(eksData);
  console.log("-----------------------------REDPANDA LAG-----------------------------\n");
  console.log(redpandaLagData);
}
