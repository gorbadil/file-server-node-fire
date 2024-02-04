import http from "http";

/**
 * Checks if a port is available for use.
 * @param port - The port number to check.
 * @param maxAttempt - The maximum number of attempts to find an available port. Default is 5.
 * @param attempt - The current attempt count. Default is 0.
 * @returns A promise that resolves to the available port or rejects if no port is found.
 */
const isPortOk = async (port: number | string, maxAttempt: number = 5, attempt: number = 0): Promise<number> => {
  console.log("Checking port:", port, "Attempt count:", attempt, "Max attempt:", maxAttempt);
  const _port = Number(port);
  const a = attempt + 1;

  let resolver!: (port: number) => void;
  let rejecter!: (error: Error) => void;

  const prm = new Promise<number>((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });

  const server = http.createServer();
  server.once("error", async function (err: any) {
    if (err.code === "EADDRINUSE") {
      console.warn("Port is in use:", _port);
      if (a < maxAttempt) {
        resolver(await isPortOk(_port + 1, maxAttempt, a));
      } else {
        console.error("Free port not found in max attempt", maxAttempt);
        rejecter(new Error("Free port not found in max attempt " + maxAttempt));
      }
    } else {
      console.error("Error occurred while checking port:", err);
      rejecter(err);
    }
  });

  server.once("listening", function () {
    console.log("Port is available:", port);
    resolver(_port);
    server.close();
  });

  server.listen(_port);

  return prm;
};
export default isPortOk;
