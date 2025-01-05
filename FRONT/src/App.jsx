import { useState, useEffect } from 'react'
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [timePeriod, setTimePeriod] = useState("6h");
  const [interval, setInterval] = useState("5m");

  const [chartData, setChartData] = useState(null);

  const timePeriodInMinutes = {
    '1h': 60,
    '3h': 180,
    '12h': 720,
    '1d': 1440,
    '3d': 4320,
    '1w': 10080,
  };

  const intervalInMinutes = {
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '1h': 60,
    '6h': 360,
    '1d': 1440,
  };

  const fetchData = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/cpu-usage", {
        ipAddress,
        timePeriod,
        interval,
      });

      const { timestamps, cpuUsages } = response.data;

      setChartData({
        labels: timestamps.map((timestamp) =>
          new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        ),
        datasets: [
          {
            label: "CPU Usage",
            data: cpuUsages,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching CPU usage data:", error);
    }
  };

  return (
    <div>
      <h1>AWS CPU Usage Monitor</h1>

      <div className="container">

        <form onSubmit={fetchData}>

          <label>
            IP Address:
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </label>

          <label>
            Time Period:
            <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
              <option value="1h">1 hour</option>
              <option value="3h">3 hours</option>
              <option value="12h">12 hours</option>
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="1w">1 week</option>
            </select>
          </label>

          <label>
            Interval:
            <select value={interval} onChange={(e) => setInterval(e.target.value)}>
              <option value="1m" disabled={intervalInMinutes['1m'] > timePeriodInMinutes[timePeriod]}>1 minute</option>
              <option value="5m" disabled={intervalInMinutes['5m'] > timePeriodInMinutes[timePeriod]}>5 minutes</option>
              <option value="15m" disabled={intervalInMinutes['15m'] > timePeriodInMinutes[timePeriod]}>15 minutes</option>
              <option value="1h" disabled={intervalInMinutes['1h'] > timePeriodInMinutes[timePeriod]}>1 hour</option>
              <option value="6h" disabled={intervalInMinutes['6h'] > timePeriodInMinutes[timePeriod]}>6 hours</option>
              <option value="1d" disabled={intervalInMinutes['1d'] > timePeriodInMinutes[timePeriod]}>1 day</option>
            </select>
          </label>

          <br />

          <button type="submit">Get CPU Usage</button>
        </form>

        {chartData && (
          <Line
            className='chart-container'
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
