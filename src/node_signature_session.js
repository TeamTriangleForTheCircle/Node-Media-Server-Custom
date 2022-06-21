const TAG = "NodeSignatureSession"
const SIGNATURE_PING_TIMEOUT = 30000

class NodeSignatureSession {
  constructor(config, socket) {
    this.config = config;
    this.socket = socket;

    this.pingTimeout = config.signature.ping_timeout ? config.signature.ping_timeout * 1000 : SIGNATURE_PING_TIMEOUT;

    this.isStarting = false;
  }

  run() {
    this.socket.on("data", this.onSocketData.bind(this));
    this.socket.on("close", this.onSocketClose.bind(this));
    this.socket.on("error", this.onSocketError.bind(this));
    this.socket.on("timeout", this.onSocketTimeOut.bind(this));
    this.socket.setTimeout(this.pingTimeout);

    this.isStarting = true;
  }

  onSocketData(data) {
    console.log(data);
  }

  onSocketClose() {
    Logger.log(`${TAG}: Socket Closed`);
    this.stop();
  }

  onSocketError(e) {
    Logger.log(`${TAG}: `, e);
    this.stop();
  }

  onSocketTimeOut() {
    Logger.log(`${TAG}: Socket Time Out`);
    this.stop();
  }

  stop() {
    if (this.isStarting) {
      this.isStarting = false;

      // TODO: Implement
    }
  }
}

module.exports = NodeSignatureSession;