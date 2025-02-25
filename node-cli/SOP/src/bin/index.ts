import { EKSSOP } from "../services/eks";
import { RedpandaSOP } from "../services/redpanda";
import { program } from "commander";

program
  .option("-a, --action <action>", "eks-usage | redpanda-lag | sop", "sop")
  .description(`Commands:
    eks-usage              Calculate EKS Usage
    redpanda-lag           Calculate Redpanda Lag
    sop                    Generate SOP
    help [command]         display help for command`)
  .parse();

const options = program.opts<{
  action: "eks-usage" | "redpanda-lag" | "sop";
}>();

if (options.action === "eks-usage") {
  const eksSOP = new EKSSOP();

  const data = eksSOP.getEKSCalculatedData();

  console.log(data);
} else if (options.action === "redpanda-lag") {
  const redpandaSOP = new RedpandaSOP();

  const data = redpandaSOP.getRedpandaLagData();

  console.log(data);
} else if (options.action === "sop") {
  const redpandaSOP = new RedpandaSOP();
  const eksSOP = new EKSSOP();

  const eksData = eksSOP.getEKSCalculatedData();
  const redpandaLagData = redpandaSOP.getRedpandaLagData();

  console.log(
    "------------------------------EKS USAGE-----------------------------"
  );
  console.log(eksData);
  console.log(
    "-----------------------------REDPANDA LAG-----------------------------\n"
  );
  console.log(redpandaLagData);
}
