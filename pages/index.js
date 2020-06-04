import Head from "next/head";
import Status from "../components/status";
import Error from "next/error";
import { useEffect, useState } from "react";
import Axios from "axios";

function Home({ title, monitorsSSR }) {
  const [error, setError] = useState(false);
  const [monitors, setMonitors] = useState(monitorsSSR ? monitorsSSR : []);

  useEffect(() => {
    if (monitors.length === 0) {
      fetch("/api")
        .then((data) => data.json())
        .then((json) => {
          setMonitors(json);
        })
        .catch(() => {
          setError("Failed to fetch service statuses. Please try again later.");
        });
    }

    setInterval(() => {
      fetch("/api")
        .then((data) => data.json())
        .then((json) => {
          setMonitors(json);
        })
        .catch(() => {});
    }, 300000);
  }, []);
  const m = !error ? monitors : [];
  const status =
    m.filter((a) => a.status !== 2).length > 0
      ? { m: "Minor Outage", c: "#f5d5be" }
      : {
          m: `All Systems Fully Operational (${m.length}/${m.length})`,
          c: "#47cbac",
        };
  return (
    <div>
      <Head>
        <title>Pixel Chat Status</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={"Pixel Chat Status"} />
        <meta
          property="og:description"
          content={title ? title : "Check the status of Pixel Chat services."}
        />
        <meta property="og:url" content="https://status.pixelchat.tv" />
        <meta property="og:type" content="website" />
      </Head>
      {!error ? (
        <div className="w-screen min-h-screen bg-gray-900 text-white">
          <div className="w-full flex justify-center">
            <div
              className="rounded-sm shadow-sm px-4 py-2 text-lg mb-6 font-semibold"
              style={{ background: status.c }}
            >
              {status.m}
            </div>
          </div>
          <div className="w-full flex flex-wrap justify-center">
            {m.map((v, k) => (
              <Status
                name={v.friendly_name}
                code={v.status}
                uptime={v.custom_uptime_ratio}
                responseTime={v.response_times}
                key={k}
              />
            ))}
          </div>
          <div className="text-center w-full">
            This page shows the status of all sites & services created by Pixel
            Dev LLC.
          </div>
          <div className="text-center w-full">
            This status page is 100% open source{" "}
            <a
              href="https://github.com/ACPixel/UptimeRobot-NextJS"
              target="_blank"
              className="text-blue-300"
            >
              here
            </a>{" "}
            if you would like to make your own. Made with ❤ by Pixel Dev LLC.
          </div>
        </div>
      ) : (
        <Error statusCode={500} title={error} />
      )}
    </div>
  );
}

Home.getInitialProps = async ({ req }) => {
  if (req) {
    try {
      let data = await Axios.get(
        `${req.secure ? "https" : "http"}://${req.headers.host}/api`
      );
      let m = data.data;
      let title =
        m.filter((a) => a.status !== 2).length > 0
          ? "Minor Outage"
          : `All Systems Fully Operational (${m.length}/${m.length})`;
      return { title, monitorsSSR: m };
    } catch {
      return;
    }
  } else {
    return;
  }
};
export default Home;
