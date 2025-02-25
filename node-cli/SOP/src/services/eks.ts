import { execSync } from "child_process";

type EKSData = {
  name: string;
  cpuCores: string;
  cpuUsage: string;
  memoryBytes: string;
  memoryUsage: string;
}[];

type ParsedEKSData = {
  name: string;
  cpuCores: number;
  cpuUsage: number;
  memoryBytes: number;
  memoryUsage: number;
}[];

type TotalResourceData = {
  totalNode: number;
  totalCPUCores: number;
  totalCPUUsage: number;
  totalMemoryBytes: number;
  totalMemoryUsage: number;
  totalAllocatableCPUCores: number;
  totalAllocatableMemoryBytes: number;
};

export class EKSSOP {
  private parseOutput(data: TotalResourceData) {
    return `
    Total Nodes: ${data.totalNode}
    Overall CPU Usage: ${data.totalCPUCores}m (${data.totalCPUUsage.toFixed(
      2
    )}%)
    Overall Memory Usage: ${
      data.totalMemoryBytes
    }Mib (${data.totalMemoryUsage.toFixed(2)}%)
    Total Allocatable CPU: ${data.totalAllocatableCPUCores.toFixed(2)}m 
    Total Allocatable Memory: ${data.totalAllocatableMemoryBytes.toFixed(2)}Mib
    `;
  }

  private parseData(data: string): ParsedEKSData {
    return data
      .split("\n")
      .slice(1, -1)
      .filter((node) => node.search("unknown") === -1)
      .map((node) => {
        const resource = node.split(/\s+/);

        return {
          name: resource[0],
          cpuCores: Number(resource[1].replace("m", "")),
          cpuUsage: Number(resource[2].replace("%", "")),
          memoryBytes: Number(resource[3].replace("Mi", "")),
          memoryUsage: Number(resource[4].replace("%", "")),
        };
      });
  }

  private calculateResourceUsage(data: ParsedEKSData) {
    const totalNodeData = data.reduce(
      (acc, node) => {
        acc.totalCPUCores += node.cpuCores;
        acc.totalAllocatableCPUCores +=
          node.cpuUsage === 0 ? 0 : node.cpuCores / (node.cpuUsage / 100);
        acc.totalMemoryBytes += node.memoryBytes;
        acc.totalAllocatableMemoryBytes +=
          node.memoryUsage === 0
            ? 0
            : node.memoryBytes / (node.memoryUsage / 100);
        return acc;
      },
      {
        totalCPUCores: 0,
        totalMemoryBytes: 0,
        totalAllocatableCPUCores: 0,
        totalAllocatableMemoryBytes: 0,
      }
    );

    return {
      totalNode: data.length,
      totalCPUCores: totalNodeData.totalCPUCores,
      totalCPUUsage:
        (totalNodeData.totalCPUCores / totalNodeData.totalAllocatableCPUCores) *
        100,
      totalMemoryBytes: totalNodeData.totalMemoryBytes,
      totalMemoryUsage:
        (totalNodeData.totalMemoryBytes /
          totalNodeData.totalAllocatableMemoryBytes) *
        100,
      totalAllocatableCPUCores: totalNodeData.totalAllocatableCPUCores,
      totalAllocatableMemoryBytes: totalNodeData.totalAllocatableMemoryBytes,
    };
  }

  public getEKSCalculatedData() {
    const eksData = execSync(
      "kubectl top nodes -l karpenter.sh/capacity-type=spot",
      {
        encoding: "utf-8",
      }
    );

    const calculatedData = this.calculateResourceUsage(this.parseData(eksData));

    return this.parseOutput(calculatedData);
  }
}
