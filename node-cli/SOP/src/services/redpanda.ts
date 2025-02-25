import { execSync } from "child_process";

type RedpandaLagData = {
  topicName: string;
  partition: string;
  currentOffset: string;
  logEndOffset: string;
  lag: string;
  memberId: string;
  clientId: string;
  host: string;
};

type RedpandaGroupData = {
  group: string;
  coordinator: string;
  state: string;
  balancer: string;
  members: string;
  totalLag: string;
  topic: RedpandaLagData[];
};

const SSH_CREDS = "ubuntu@ims.opexa.io";
const SSH_KEY = "ims-production.pem";

//needs s3 bucket output to get all data
const SSM_COMMAND = `aws ssm get-command-invocation --command-id $(aws ssm send-command --instance-ids "i-00f2e5816f93e5649" --document-name "AWS-RunShellScript" --parameters "commands=['rpk group describe \$(rpk group list | awk \'NR > 1 { print \"\" \$2 \"\" }\')']" --query "Command.CommandId" --output text) --instance-id "i-00f2e5816f93e5649" --query "StandardOutputContent" --output text`;

export class RedpandaSOP {
  private parseOutput(data: RedpandaGroupData[]) {
    const sortedData = data
      .sort((a, b) => Number(b.totalLag) - Number(a.totalLag))
      .filter((lag) => Number(lag.totalLag) >= 150);

    const output =
      sortedData.length > 0
        ? sortedData.map((lag, i) => {
            const topics = lag.topic.map((topic) => {
              return `${topic.topicName}: ${topic.lag}`;
            });
            return `${i + 1}) \tTOTAL-LAG: ${lag.totalLag}\n\tGROUP: ${
              lag.group
            }\n\tTOPICS: \n\t\t${topics.join("\n\t\t")}`;
          })
        : ["All Clear!"];

    return output.join("\n\n");
  }

  private parseData(data: string) {
    const groupData = data.split(new RegExp("\n\nGRO", "g")).map((val) => {
      const [header, topic] = val.split(new RegExp("\n\nTOPIC", "g"));
      const [group, coordinator, state, balancer, members, totalLag] = header
        .trim()
        .split("\n")
        .map((line) => line.match(/\s.*/)?.[0].trim() ?? "");

      const lag = topic
        ?.split("\n")
        .slice(1)
        .map((line) => {
          const [
            topicName,
            partition,
            currentOffset,
            logEndOffset,
            lag,
            memberId,
            clientId,
            host,
          ] = line.split(/\s+/);

          return {
            topicName,
            partition,
            currentOffset,
            logEndOffset,
            lag,
            memberId,
            clientId,
            host,
          };
        });

      return {
        group,
        coordinator,
        state,
        balancer,
        members,
        totalLag,
        topic: lag ?? [],
      };
    });

    groupData.pop();

    return groupData;
  }

  public getRedpandaLagData() {
    const lagData = execSync(
      `ssh ${SSH_CREDS} -i ~/.ssh/${SSH_KEY} "rpk group describe \\$(rpk group list | awk 'NR > 1 { print "" \\$2 "" }')"`,
      {
        encoding: "utf-8",
      }
    );

    const parseData = this.parseData(lagData);

    return this.parseOutput(parseData);
  }
}
