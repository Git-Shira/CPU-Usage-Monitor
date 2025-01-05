# CPU Usage Monitor

This project allows you to monitor the CPU usage of an AWS instance over time. By providing an IP address, time period, and sampling interval, the system displays a chart showing the instance's CPU usage.

## Overview

The goal of this project is to extract performance information for an AWS instance and display the CPU usage over time.

## Inputs

Provide the following inputs through the client interface:

1. **IP Address**: The IP address of the AWS instance. This specifies the target instance for monitoring.
2. **Time Period**: The duration for which the chart should display CPU usage (e.g., last 1 hour, last 24 hours). Determines the range of data shown in the chart.
3. **Sample Interval**: The interval between each sample (e.g., every 5 seconds, every 1 minute). Controls the granularity of data points.

## Prerequisites

- **Node.js** and **npm** installed on your system.
- An AWS account with the necessary credentials for accessing instance performance data.

## Setup

### Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>  # Your AWS Access Key ID used for authentication
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>  # Your AWS Secret Access Key used for authentication
```

Replace `<your_aws_access_key_id>` and `<your_aws_secret_access_key>` with your actual AWS credentials.

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd BACK
   ```

2. Install the dependencies:

   ```bash
   npm install  # Installs all required packages listed in package.json for the backend
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd FRONT
   ```

2. Install the dependencies:

   ```bash
   npm install  # Installs all required packages listed in package.json for the frontend
   ```

## Usage

### Start the Server

To start the server, run the following command from the `BACK` directory:

```bash
node index.js  # Launches the backend server to handle requests
```

### Start the Client

To start the client application, run the following command from the `FRONT` directory:

```bash
npm run dev  # Starts the frontend development server for the user interface
```

## Notes

- Ensure all required AWS permissions are in place to access performance data.
