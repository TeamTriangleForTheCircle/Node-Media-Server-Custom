const crypto = require("crypto");
const fs = require("fs");

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
    // Check if data is signature.
    if (data.length === 512) {
      const PAYLOAD = Buffer.concat(this.payloads);
      const PAYLOAD_HASH = crypto.createHash("sha256").update(PAYLOAD).digest("base64");
      
      const PUBLIC_KEY = 'Some value';

      const SIGNATURE_HASH = crypto.publicDecrypt({
        key: PUBLIC_KEY,
        padding: constants.RSA_NO_PADDING,
      }, Buffer.from(data, "base64")).toString("base64");
      
      if (PAYLOAD_HASH === SIGNATURE_HASH) console.log("Correct!");
      this.payloads = [];
    } else {
      if ((data[0] === 1 && data[1] === 2 && data[2] === 3) && this.payloads.length > 0) this.payloads = [];

      this.payloads.push(data);
    }
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