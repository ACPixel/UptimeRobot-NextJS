import React from "react";
import Trend from "react-trend";

export default function Status({ name, code, uptime, responseTime }) {
  return (
    <div
      className="rounded-sm bg-gray-700 m-4 p-4 relative"
      style={{ width: "32rem", height: "20rem" }}
    >
      <h1 className="text-3xl font-bold text-blue-200">{name}</h1>
      <div
        className="m-4 absolute top-0 right-0 rounded-full w-4 h-4"
        style={{
          background:
            code === 2
              ? "#47cbac"
              : code === 1
              ? "#1a202c"
              : code === 8
              ? "#f5d5be"
              : "#cd43b3",
        }}
      />
      <div className="text-xl mb-4">
        Current status:{" "}
        <span className="text-blue-400">
          {code === 2
            ? "Up"
            : code === 1
            ? "Checking"
            : code === 8
            ? "Minor Outage"
            : "Down"}
        </span>
      </div>
      <div>
        Up{" "}
        <span className="text-blue-400">
          {Number(uptime.split("-")[0]).toFixed(2)}%
        </span>{" "}
        over <span className="text-blue-400">7</span> days
      </div>
      <div>
        Up{" "}
        <span className="text-blue-400">
          {Number(uptime.split("-")[1]).toFixed(2)}%
        </span>{" "}
        over <span className="text-blue-400">30</span> days
      </div>

      <div className="mt-4">Average Response Times:</div>
      <div className="w-full">
        <Trend
          smooth
          autoDraw
          autoDrawDuration={3000}
          data={responseTime.map((a) => a.value)}
          gradient={["#47cbac", "#47cbac", "#f5d5be", "#cd43b3"]}
          strokeWidth={2}
          strokeLinecap={"round"}
          padding={0}
        />
      </div>
    </div>
  );
}
