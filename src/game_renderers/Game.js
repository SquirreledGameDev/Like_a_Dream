import Player from "./Player";
import FallingSubs from "./FallingSubs";

class Stack {
  stack = [];
  max;

  constructor(max = 10) {
    this.max = max;
  }

  add(number) {
    this.stack.push(number);
    if (this.stack.length > this.max) {
      this.stack.shift();
    }
  }
  sum() {
    let sum = 0;
    for (let item of this.stack) sum += item;
    return sum;
  }
  avg() {
    return this.sum() / this.stack.length;
  }
}

class GS {
  static td = 0;
  static tMain = 0;
  static ctx;
  static cnv;
  static lastOffsetDelta = 0;

  static currMoveFrame = 30;
  moveFrameStack = new Stack(12);

  dragBuffer = 0;
  timesOfFillingBuffer = 0;

  static notes = [
    { i: 0, startingSN: 100, track: 2, text: "SUBSCRIBE" }
    //{ i: 1, startingSN: 127, track: 0 }
  ];

  static playerHead = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };

  static playerBody = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };

  static score = 0;
  d;
  static setScore = () => {};

  static defCnvW = () =>
    window.innerHeight * 0.6 > window.innerWidth
      ? window.innerWidth
      : window.innerHeight * 0.6;
  static defCnvH = () => window.innerHeight;

  static w(number) {
    if (typeof number === "undefined") return GS.defCnvW();
    return GS.defCnvW() * (number / 100);
  }
  static h(number) {
    if (typeof number === "undefined") return GS.defCnvH();
    return GS.defCnvH() * (number / 100);
  }
  static midX = (width) => (GS.defCnvW() - width) / 2;
  static midY = (height) => (GS.defCnvH() - height) / 2;

  static findIntersection = (xa, ya, xb, yb, xc, yc, xd, yd) => {
    if (!xa || !ya || !xb || !yb || !xc || !yc || !xd || !yd) return false;
    if (xd < xa || xb < xc || yd < ya || yb < yc) {
      return false;
    }
    return true;
  };

  static LMB = false;
  static dragOffset = 0;

  prevMainDelta = 0;

  player = new Player();
  FallingSubs = new FallingSubs();

  mainLoop(mainDelta = 0) {
    try {
      GS.ctx.clearRect(0, 0, GS.w(), GS.h());

      GS.ctx.beginPath();
      GS.ctx.fillStyle = "#fff";
      GS.ctx.fillRect(0, 0, GS.w(), GS.h());

      if (mainDelta) {
        GS.td = (mainDelta - this.prevMainDelta) / 1000;
      }
      this.prevMainDelta = mainDelta;

      GS.tMain += GS.td;

      this.FallingSubs.render();

      GS.ctx.stroke();

      GS.ctx.beginPath();
      this.player.render();

      this.moveFrameStack.add(this.timesOfFillingBuffer);
      let nextFrame = 30 - Math.round(this.moveFrameStack.avg());
      if (nextFrame > 60) nextFrame = 60;
      if (nextFrame < 0) nextFrame = 0;
      GS.currMoveFrame = nextFrame;

      if (GS.tMain < 1.5) {
      }

      GS.ctx.stroke();

      requestAnimationFrame(this.mainLoop.bind(this));
    } catch (err) {
      console.log("Error in canvas. Infinite loop will flood your app!");
    }
  }

  cancelAllAnimFrame() {
    let id = window.requestAnimationFrame(() => {
      for (let i = id; i >= id - 500; i--) {
        window.cancelAnimationFrame(id);
      }
    });
  }

  calculateBuffer() {
    let maximalSize = GS.w(0.2);
    let bufferOffset = (this.dragBuffer + GS.lastOffsetDelta) % maximalSize;
    let timesOfFillingBuffer =
      (this.dragBuffer + GS.lastOffsetDelta) / maximalSize;
    this.dragBuffer = -bufferOffset;
    this.timesOfFillingBuffer = timesOfFillingBuffer;
  }

  static checkIntersection(e, x, y, a, b) {
    let canvasDOM = document.querySelector("canvas");
    let cx = e.clientX - canvasDOM.offsetLeft,
      cy = e.clientY - canvasDOM.offsetTop;

    if (cx < x + a && cx > x && cy < y + b && cy > y) {
      return true;
    }
    return false;
  }

  setInteractionListeners() {
    let canvasDOM = document.querySelector("canvas");

    let oldDragPos, newDragPos;

    function isChaarcterDragged(e) {
      let x1 = GS.playerHead.x + GS.dragOffset,
        a1 = GS.playerHead.w,
        y1 = GS.playerHead.y,
        b1 = GS.playerHead.h;

      let x2 = GS.playerBody.x + GS.dragOffset,
        a2 = GS.playerBody.w,
        y2 = GS.playerBody.y,
        b2 = GS.playerBody.h;

      if (
        GS.checkIntersection(e, x1, y1, a1, b1) ||
        GS.checkIntersection(e, x2, y2, a2, b2)
      ) {
        return true;
      } else {
        return false;
      }
    }

    window.onmousedown = (e) => {
      GS.LMB = true;
    };
    window.onmouseup = (e) => {
      GS.LMB = false;
      oldDragPos = undefined;
      newDragPos = undefined;
      this.timesOfFillingBuffer = 0;
    };
    window.onmousemove = (e) => {
      if (GS.LMB) {
        newDragPos = e.clientX;
        if (oldDragPos) {
          let dragDelta = newDragPos - oldDragPos;
          if (
            GS.playerHead.x + GS.dragOffset + dragDelta >= 0 &&
            GS.playerHead.x + GS.dragOffset + dragDelta <=
              GS.w() - GS.playerHead.w
          ) {
            GS.dragOffset += dragDelta;
            GS.lastOffsetDelta = dragDelta;
            this.calculateBuffer();
          } else {
            GS.playerHead.x + GS.dragOffset + dragDelta < 0
              ? (GS.dragOffset = -GS.playerHead.x)
              : (GS.dragOffset = GS.playerHead.x);
            this.timesOfFillingBuffer = 0;
          }
        }
        oldDragPos = newDragPos;
      }
    };
  }

  _init(cnv) {
    GS.cnv = cnv;
    GS.ctx = cnv.getContext("2d");

    window.addEventListener("resize", () => {
      GS.cnv.width = GS.defCnvW();
      GS.cnv.height = GS.defCnvH();
    });

    this.cancelAllAnimFrame();
    this.setInteractionListeners();
    this.mainLoop();
  }
}
export default GS;
