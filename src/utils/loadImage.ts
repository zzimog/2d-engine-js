function loadImage(url: string) {
  return new Promise<HTMLImageElement>((Resolve) => {
    const image = new Image();

    image.onload = () => {
      Resolve(image);
    };

    image.onerror = () => {
      throw new Error(`Image error: ${url}`);
    };

    image.src = url;
  });
}

export default loadImage;
