import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CallbackResponse {
  data?: any;
}

export interface CallbackServerConfig {
  initialData?: any;
}

class CallbackServer {
  private static instance: CallbackServer;
  private server: Server | null = null;
  private app: express.Express;
  private port: number;
  private previewerPath: string;
  private responseHandlers: Map<
    string,
    { resolve: (data: CallbackResponse) => void; initialData?: any }
  > = new Map();

  private constructor(port = 3333) {
    this.port = port;
    this.app = express();
    this.previewerPath = path.join(__dirname, "../../previewer");
    this.setupServer();
  }

  static getInstance(port?: number): CallbackServer {
    if (!CallbackServer.instance) {
      CallbackServer.instance = new CallbackServer(port);
    }
    return CallbackServer.instance;
  }

  private setupServer() {
    this.app.use(express.json());
    this.app.use(express.static(this.previewerPath));
    // app.use(
    //   cors({
    //     origin: "*",
    //     methods: ["GET", "POST", "OPTIONS"],
    //     allowedHeaders: ["Content-Type"],
    //   })
    // );

    this.app.get("/callback/:id", (req, res) => {
      const { id } = req.params;
      const initialData = this.responseHandlers.get(id)?.initialData;
      res.json({ status: "success", data: initialData });
    });

    this.app.post("/callback/:id", (req, res) => {
      const { id } = req.params;
      const handler = this.responseHandlers.get(id);

      if (handler) {
        const data = req.body || {};
        handler.resolve({ data });
        this.responseHandlers.delete(id);
      }

      res.json({ status: "success" });
    });

    this.app.get("*", (req, res) => {
      res.sendFile(path.join(this.previewerPath, "index.html"));
    });
  }

  async startServer(): Promise<void> {
    if (!this.server) {
      this.server = this.app.listen(this.port, "127.0.0.1", () => {
        const address = this.server?.address() as AddressInfo;
        const previewUrl = `http://127.0.0.1:${address.port}`;
        console.log(`Preview server running at ${previewUrl}`);
      });

      this.server.on("error", (error: Error) => {
        console.error("Server error:", error);
      });
    }
  }

  async promptUser(
    config: CallbackServerConfig = {}
  ): Promise<CallbackResponse> {
    const { initialData = null } = config;

    await this.startServer();
    const id = Math.random().toString(36).substring(7);

    return new Promise<CallbackResponse>(async (resolve) => {
      this.responseHandlers.set(id, { resolve, initialData });

      if (!this.server) {
        await this.startServer();
      }

      const address = this.server!.address() as AddressInfo;
      const previewUrl = `http://127.0.0.1:${address.port}?id=${id}`;
      open(previewUrl);
    });
  }
}

export const callbackServer = CallbackServer.getInstance();
