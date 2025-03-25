function loadImage(url) {
  return new Promise((Resolve) => {
    const img = new Image();
    img.onload = () => Resolve(img);
    img.src = url;
  });
}

export default loadImage;
