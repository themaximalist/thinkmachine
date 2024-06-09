// TODO: Max size
import { blobToBase64, base64ToBlob, downloadImage } from "@lib/utils";

// records webm and converts to mp4
export default class Recorder {
    constructor(canvas = null, options = {}) {
        this.canvas = canvas || Recorder.canvas;
        if (!this.canvas) {
            console.error("Canvas not found");
            return;
        }

        this.fps = options.fps || 30;
        this.bps = options.bps || 1024 * 1024 * 50;
        this.mimeType = options.mimeType || "video/webm; codecs=vp9";
        this.videoType = "mp4";


        this.onstart = options.onstart || async function () { };
        this.onstop = options.onstop || async function () { };
        this.onerror = options.onerror || async function () { };
        this.ondata = options.ondata || async function () { };
        this.onprocess = options.onprocess || async function () { };
        this.onfile = options.onfile || async function () { };

        this.stream = null;
        this.recorder = null;
        this.chunks = [];
        this.bytes = 0;
    }

    get recording() {
        return this.recorder;
    }

    async start() {
        if (!this.canvas) {
            console.error("Canvas not found");
            return;
        }

        if (this.stream) {
            console.error("Recording already started");
            return;
        }

        this.stream = this.canvas.captureStream(this.fps);

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            bitsPerSecond: 40000000 // 4k
        });

        this.recorder.addEventListener("start", this.handleStart.bind(this), false);
        this.recorder.addEventListener("stop", this.handleStop.bind(this), false);
        this.recorder.addEventListener("dataavailable", this.handleData.bind(this), false);
        this.recorder.addEventListener("error", this.handleError.bind(this), false);

        this.recorder.start(1000);

        await this.onstart();
    }

    async stop() {
        if (this.recorder && this.recorder.state !== "inactive") {
            this.recorder.stop();
        }
    }

    reset() {
        this.recorder = null;
        this.stream = null;
        this.chunks = [];
        this.bytes = 0;
    }

    handleStart() {
        console.log("START RECORDER");
    }

    async handleStop() {
        if (this.chunks.length === 0) {
            console.error("No data recorded");
            return;
        }

        await this.onstop();

        const webmBlob = new Blob(this.chunks, { "type": this.chunks[0].type });

        await this.onprocess();

        try {
            const webmBuffer = await blobToBase64(webmBlob);
            const mp4Buffer = await window.api.webmToMp4(webmBuffer);
            const mp4Blob = await base64ToBlob(mp4Buffer, "video/mp4");
            await this.onfile(mp4Blob);
        } catch (e) {
            await this.onerror(e);
        }
    }

    handleData(event) {
        const blob = event.data;

        if (blob.size) {
            this.chunks.push(blob);
            this.bytes += blob.size;
        }
    }

    handleError(e) {
        console.log("ON ERROR", e);
    }


    static get canvas() {
        return document.querySelector("canvas");
    }

    static async takeScreenshot(name = "thinkmachine-screenshot") {
        requestAnimationFrame(() => {
            const image = Recorder.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            downloadImage(image, `${name}.png`);
        });
    }
}