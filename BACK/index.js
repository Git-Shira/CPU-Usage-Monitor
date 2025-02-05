const express = require("express");
const cors = require("cors");

const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const { CloudWatchClient, GetMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Initialize EC2 and CloudWatch clients
const ec2 = new EC2Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const cloudwatchClient = new CloudWatchClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to get Instance ID based on IP Address
const getInstanceId = async (ipAddress) => {
    const params = {
        Filters: [
            {
                Name: 'private-ip-address',
                Values: [ipAddress],
            },
        ],
    };

    try {
        const data = await ec2.send(new DescribeInstancesCommand(params));
        const instanceId = data.Reservations[0].Instances[0].InstanceId;
        console.log("Instance ID:", instanceId);
        return instanceId;
    } catch (err) {
        console.error("Error fetching instance ID:", err);
        return null;
    }
};

// Fetch CPU usage data
app.post("/cpu-usage", async (req, res) => {
    const { ipAddress, timePeriod, interval } = req.body;

    try {
        const instanceId = await getInstanceId(ipAddress);
        if (!instanceId) {
            return res.status(400).json({ error: "Instance ID not found" });
        }

        const params = {
            StartTime: new Date(Date.now() - parseTimePeriod(timePeriod)),
            EndTime: new Date(),
            MetricDataQueries: [
                {
                    Id: "cpuUsage",
                    MetricStat: {
                        Metric: {
                            Namespace: "AWS/EC2",
                            MetricName: "CPUUtilization",
                            Dimensions: [
                                {
                                    Name: "InstanceId",
                                    Value: instanceId,
                                },
                            ],
                        },
                        Period: parseInterval(interval),
                        Stat: "Average",
                    },
                },
            ],
        };

        const command = new GetMetricDataCommand(params);
        const data = await cloudwatchClient.send(command);

        const timestamps = data.MetricDataResults[0].Timestamps;
        const cpuUsages = data.MetricDataResults[0].Values;

        res.json({ timestamps, cpuUsages });
    } catch (error) {
        console.error("Error fetching data from CloudWatch:", error);
        res.status(500).json({ error: "Failed to fetch data from CloudWatch" });
    }
});

// Convert time period to milliseconds
function parseTimePeriod(period) {
    if (period.endsWith("h")) {
        return parseInt(period) * 60 * 60 * 1000;
    } else if (period.endsWith("d")) {
        return parseInt(period) * 24 * 60 * 60 * 1000;
    } else if (period.endsWith("w")) {
        return parseInt(period) * 7 * 24 * 60 * 60 * 1000;
    }
    return 0;
}

// Convert interval time to seconds
function parseInterval(interval) {
    if (interval.endsWith("m")) {
        return parseInt(interval) * 60;
    } else if (interval.endsWith("h")) {
        return parseInt(interval) * 60 * 60;
    } else if (interval.endsWith("d")) {
        return parseInt(interval) * 24 * 60 * 60;
    }
    return 60;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});