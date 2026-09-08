import sharp from 'sharp';

export interface ExtractedComponent {
  x: number;
  y: number;
  width: number;
  height: number;
  pixels: number;
}

// Universal transparent region detector with padding trimming
export async function extractComponents(
  filePath: string,
  minArea = 50,
  alphaThreshold = 25
): Promise<ExtractedComponent[]> {
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const visited = new Uint8Array(w * h);
  const components: ExtractedComponent[] = [];

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const idx = y * w + x;
      if (visited[idx]) continue;
      if (data[idx * 4 + 3] > alphaThreshold) {
        let minX = x;
        let maxX = x;
        let minY = y;
        let maxY = y;
        let count = 0;
        const q = [x, y];
        visited[idx] = 1;
        let head = 0;
        while (head < q.length) {
          const cx = q[head++];
          const cy = q[head++];
          count++;
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          const neighbors = [
            [cx + 2, cy],
            [cx - 2, cy],
            [cx, cy + 2],
            [cx, cy - 2],
            [cx + 4, cy],
            [cx - 4, cy],
            [cx, cy + 4],
            [cx, cy - 4],
          ];
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nidx = ny * w + nx;
              if (!visited[nidx]) {
                visited[nidx] = 1;
                if (data[nidx * 4 + 3] > alphaThreshold) {
                  q.push(nx, ny);
                }
              }
            }
          }
        }
        const bw = maxX - minX + 1;
        const bh = maxY - minY + 1;
        if (bw >= 8 && bh >= 8 && count >= minArea) {
          // Refine exact bounding box by checking alpha
          let trueMinX = minX;
          let trueMaxX = maxX;
          let trueMinY = minY;
          let trueMaxY = maxY;
          for (let cy = minY; cy <= maxY; cy++) {
            for (let cx = minX; cx <= maxX; cx++) {
              if (data[(cy * w + cx) * 4 + 3] > alphaThreshold) {
                if (cx < trueMinX) trueMinX = cx;
                if (cx > trueMaxX) trueMaxX = cx;
                if (cy < trueMinY) trueMinY = cy;
                if (cy > trueMaxY) trueMaxY = cy;
              }
            }
          }
          components.push({
            x: trueMinX,
            y: trueMinY,
            width: trueMaxX - trueMinX + 1,
            height: trueMaxY - trueMinY + 1,
            pixels: count,
          });
        }
      }
    }
  }

  return components;
}
