import sharp from "sharp";

// width and height of an image in /public, so the page can reserve its space
// before the file loads.
export async function imageSize(src) {
    const { width, height } = await sharp(`public${src}`).metadata();
    return { width, height };
}
