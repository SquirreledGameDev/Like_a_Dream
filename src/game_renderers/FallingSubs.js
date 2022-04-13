import GS from "./Game";

export default class FallingSubs {
  render() {
    try {
      let bh = GS.w(120),
        bw = GS.w(90);
      let bx = GS.w(5),
        by = 0;
      GS.ctx.rect(bx, by, bw, bh);
      let offset = (GS.w() - bw) / 2;
      GS.ctx.moveTo(offset + bw / 4, 0);
      GS.ctx.lineTo(offset + bw / 4, by + bh);
      GS.ctx.moveTo(offset + (2 * bw) / 4, 0);
      GS.ctx.lineTo(offset + (2 * bw) / 4, by + bh);

      GS.ctx.moveTo(offset + (3 * bw) / 4, 0);
      GS.ctx.lineTo(offset + (3 * bw) / 4, by + bh);

      let notes = GS.notes;
      let currSN = (GS.tMain * 120) / 15;
      let subO = GS.w(2);
      let subW = bw / 4 - subO * 2,
        subH = subW * 0.5;

      let subFontSize = GS.w(3);

      notes.map((n) => {
        let subX = offset + subO + (bw / 4) * n.track,
          subY;
        let temp1 = currSN - n.startingSN;
        if (temp1 >= -20) {
          subY = (bh / 16) * temp1;
          if (subY <= bh - 20) {
            GS.ctx.fillStyle = "#CC0000";
            GS.ctx.fillRect(subX, subY, subW, subH);

            GS.ctx.font = `${subFontSize}px Arial`;
            let subFontW = GS.ctx.measureText(n.text).width;

            GS.ctx.fillStyle = "#ffffff";
            GS.ctx.fillText(
              n.text,
              subX + 0.5 * (subW - subFontW),
              subY + 0.5 * (subH + subFontSize)
            );
            GS.ctx.fillStyle = "#000000";
          }
        }

        if (!n.intersected) {
          let temp = GS.findIntersection(
            GS.playerHead.ox,
            GS.playerHead.y,
            GS.playerHead.ox + GS.playerHead.w,
            GS.playerHead.y + GS.playerHead.h,
            subX,
            subY,
            subX + subW,
            subY + subH
          );
          if (temp) {
            n.intersected = true;
            let l = Math.abs(
              subX + subW / 2 - (GS.playerHead.ox + GS.playerHead.w / 2)
            );
            console.log(l);
          }
        }
      });
    } catch (err) {
      console.log("Error in Player");
      throw err;
    }
  }
}
