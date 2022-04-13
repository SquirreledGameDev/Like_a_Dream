import GS from "./Game";

export default class Player {
  rigMoveFrames = [];
  head = new Image();

  constructor() {
    this.head.src = "/assets/frames/dream_head-min.png";
    for (let i = 0; i < 61; i++) {
      this.rigMoveFrames.push(new Image(720, 720));
      this.rigMoveFrames[i].src = `/assets/frames/rig_move/00${(() => {
        if (i < 10) return "0" + i;
        return i;
      })()}-min.png`;
    }
  }

  render() {
    try {
      let hh = GS.w(15),
        hw = GS.w(15);
      let hx = GS.midX(hw) + GS.w(0.5),
        hy = GS.w(105);

      GS.playerHead = {
        x: hx,
        y: hy,
        w: hw,
        h: hh,
        ox: hx + GS.dragOffset
      };

      //body
      let bh = GS.w(115),
        bw = GS.w(115),
        bx = GS.midX(bw),
        by = hy - (bw - hw) / 2;

      GS.playerBody = {
        x: bx,
        y: by,
        w: bw,
        h: bh
      };

      GS.ctx.drawImage(
        this.rigMoveFrames[GS.currMoveFrame],
        bx + GS.dragOffset,
        by,
        bw,
        bh
      );
      //head
      GS.ctx.drawImage(this.head, hx + GS.dragOffset, hy, hw, hh);
    } catch (err) {
      console.log("Error in Player");
      throw err;
    }
  }
}
