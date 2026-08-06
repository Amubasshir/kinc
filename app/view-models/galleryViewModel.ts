import type { GalleryPageViewModel, GalleryTileModel } from "../models/site";

const tileHeights = [
  390, 272, 364, 569, 408, 565, 451, 288, 377, 406, 446, 272, 569, 408, 565, 565, 288, 377, 404, 328, 272, 329, 559,
  451, 565, 408, 446, 406, 565, 408, 366, 588, 377, 377, 288, 390, 569, 364, 435, 408, 288, 451, 569, 377, 272, 446,
  288, 569, 565, 565, 272, 565, 288, 272, 404, 303, 328, 565, 451, 584, 288, 514, 649, 272,
];

const columnSequences = [
  [39, 4, 8, 12, 6, 20, 7, 11, 6, 9, 4, 8, 2, 6, 56, 60],
  [1, 5, 9, 4, 8, 2, 6, 10, 5, 34, 3, 7, 11, 6, 19, 8, 2],
  [2, 6, 10, 5, 9, 22, 5, 31, 8, 39, 4, 8, 2, 6, 20, 7, 62],
  [3, 7, 11, 6, 19, 23, 32, 1, 5, 9, 4, 8, 2, 6, 63],
];

const labels = [
  "colourful collage artwork",
  "warm colour tile",
  "childhood collage portrait",
  "abstract floral artwork",
  "child holding a collage outdoors",
];

function tile(number: number, index: number): GalleryTileModel {
  return {
    src: `/gallery-page/tile-${String(number).padStart(2, "0")}.png`,
    width: 314,
    height: tileHeights[number - 1],
    alt: labels[(number + index) % labels.length],
  };
}

export function getGalleryViewModel(): GalleryPageViewModel {
  return { columns: columnSequences.map((column) => column.map(tile)) };
}
