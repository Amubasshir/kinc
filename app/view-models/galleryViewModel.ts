import type { GalleryMediaKind, GalleryMediaModel, GalleryPageViewModel } from "../models/site";

type GalleryAssetSeed = readonly [fileName: string, kind: GalleryMediaKind, width: number, height: number];

const assetSeeds: GalleryAssetSeed[] = [
  ["410B71F0-4287-401C-9726-B1B54ACBE037.JPG", "image", 1206, 2144],
  ["att.16R7G5S1sZ2mKRSZKCFZASXzYVOUEUL-UQZM59xaOgg.mp4", "video", 720, 1280],
  ["att.938lxo4c-Sb5M7dDk9mjIs0jx4MD-8tIveW6L4IZdG0.mp4", "video", 720, 1280],
  ["att.PjvDSzKlCZwzgf7amj8qfpkJ7zRRQErqfwu1G39vY_o.jpg", "image", 1536, 2048],
  ["BF664436-2AE2-458D-ACF3-01406056BC34.JPG", "image", 1206, 2144],
  ["Image-1.png", "image", 1408, 1816],
  ["Image-2.png", "image", 1408, 1816],
  ["Imagex.png", "image", 1408, 1816],
  ["IMG_1580.JPG", "image", 2062, 2978],
  ["IMG_2279.HEIC", "image", 3024, 4032],
  ["IMG_2282.HEIC", "image", 3024, 4032],
  ["IMG_2479.HEIC", "image", 3024, 4032],
  ["IMG_2628.HEIC", "image", 3024, 4032],
  ["IMG_2717.HEIC", "image", 3024, 4032],
  ["IMG_2862.MOV", "video", 1080, 1920],
  ["IMG_2942.HEIC", "image", 3024, 4032],
  ["IMG_3025.JPG", "image", 3024, 4032],
  ["IMG_3072.HEIC", "image", 3024, 4032],
  ["IMG_3245.HEIC", "image", 3024, 4032],
  ["IMG_3248.HEIC", "image", 3024, 4032],
  ["IMG_3603.HEIC", "image", 3024, 4032],
  ["IMG_3657.JPG", "image", 3024, 4032],
  ["IMG_3677.JPG", "image", 3024, 4032],
  ["IMG_3786.HEIC", "image", 3024, 4032],
  ["IMG_3863.JPG", "image", 3024, 4032],
  ["IMG_4003.HEIC", "image", 3024, 4032],
  ["IMG_4073.MOV", "video", 1080, 1920],
  ["IMG_4078.HEIC", "image", 3024, 4032],
  ["IMG_4098.HEIC", "image", 3024, 4032],
  ["IMG_4125.mov", "video", 1080, 1920],
  ["IMG_4146.MOV", "video", 1080, 1920],
  ["IMG_4174.JPG", "image", 3024, 4032],
  ["IMG_6449.JPG", "image", 3024, 4032],
  ["IMG_8993.heic", "image", 2919, 3431],
  ["IMG_8997.heic", "image", 2011, 2625],
  ["IMG_9011.HEIC", "image", 4284, 5712],
];

const media: GalleryMediaModel[] = assetSeeds.map(([fileName, kind, width, height], index) => ({
  kind,
  src: `/gallery-page/gallery-images/${fileName}`,
  fallbackSrc: kind === "image" && /\.heic$/i.test(fileName)
    ? `/gallery-page/gallery-images/browser-fallbacks/${fileName.replace(/\.[^.]+$/, ".jpg")}`
    : undefined,
  width,
  height,
  alt: `KinCollage gallery ${kind} ${index + 1}`,
}));

const galleryColumnCount = 4;
const galleryGapRatio = 0.054;
const commissionCardRatio = 0.974;
let columns: GalleryMediaModel[][] = Array.from({ length: galleryColumnCount }, () => []);
const columnHeights = Array.from({ length: galleryColumnCount }, () => 0);

media.forEach((item) => {
  const targetColumnIndex = columnHeights.reduce(
    (shortestIndex, columnHeight, index) => (columnHeight < columnHeights[shortestIndex] ? index : shortestIndex),
    0,
  );
  const targetColumn = columns[targetColumnIndex];
  targetColumn.push(item);
  columnHeights[targetColumnIndex] += item.height / item.width + galleryGapRatio;

  if (targetColumnIndex === 1 && targetColumn.length === 6) {
    columnHeights[targetColumnIndex] += commissionCardRatio;
  }
});

const mediaOrder = new Map(media.map((item, index) => [item.src, index]));

function cloneColumns(source: GalleryMediaModel[][]): GalleryMediaModel[][] {
  return source.map((column) => [...column]);
}

function sortColumn(column: GalleryMediaModel[]) {
  column.sort((left, right) => (mediaOrder.get(left.src) ?? 0) - (mediaOrder.get(right.src) ?? 0));
}

function getColumnHeight(column: GalleryMediaModel[], columnIndex: number) {
  const mediaHeight = column.reduce((total, item) => total + item.height / item.width, 0);
  const gapHeight = Math.max(0, column.length - 1) * galleryGapRatio;
  const commissionHeight = columnIndex === 1 && column.length >= 6 ? commissionCardRatio : 0;
  return mediaHeight + gapHeight + commissionHeight;
}

function getBalanceRange(candidate: GalleryMediaModel[][]) {
  const heights = candidate.map((column, index) => getColumnHeight(column, index));
  return Math.max(...heights) - Math.min(...heights);
}

let balanceRange = getBalanceRange(columns);
let searchingForBalance = true;

while (searchingForBalance) {
  searchingForBalance = false;
  let bestCandidate: GalleryMediaModel[][] | null = null;
  let bestRange = balanceRange;

  for (let fromColumn = 0; fromColumn < galleryColumnCount; fromColumn += 1) {
    for (let toColumn = 0; toColumn < galleryColumnCount; toColumn += 1) {
      if (fromColumn === toColumn || (fromColumn === 1 && columns[fromColumn].length <= 6)) continue;

      for (let itemIndex = 0; itemIndex < columns[fromColumn].length; itemIndex += 1) {
        const candidate = cloneColumns(columns);
        const [item] = candidate[fromColumn].splice(itemIndex, 1);
        candidate[toColumn].push(item);
        sortColumn(candidate[fromColumn]);
        sortColumn(candidate[toColumn]);
        const candidateRange = getBalanceRange(candidate);

        if (candidateRange < bestRange) {
          bestCandidate = candidate;
          bestRange = candidateRange;
        }
      }
    }
  }

  for (let leftColumn = 0; leftColumn < galleryColumnCount; leftColumn += 1) {
    for (let rightColumn = leftColumn + 1; rightColumn < galleryColumnCount; rightColumn += 1) {
      for (let leftIndex = 0; leftIndex < columns[leftColumn].length; leftIndex += 1) {
        for (let rightIndex = 0; rightIndex < columns[rightColumn].length; rightIndex += 1) {
          const candidate = cloneColumns(columns);
          const leftItem = candidate[leftColumn][leftIndex];
          const rightItem = candidate[rightColumn][rightIndex];
          candidate[leftColumn][leftIndex] = rightItem;
          candidate[rightColumn][rightIndex] = leftItem;
          sortColumn(candidate[leftColumn]);
          sortColumn(candidate[rightColumn]);
          const candidateRange = getBalanceRange(candidate);

          if (candidateRange < bestRange) {
            bestCandidate = candidate;
            bestRange = candidateRange;
          }
        }
      }
    }
  }

  if (bestCandidate) {
    columns = bestCandidate;
    balanceRange = bestRange;
    searchingForBalance = true;
  }
}

export function getGalleryViewModel(): GalleryPageViewModel {
  return { media, columns };
}
