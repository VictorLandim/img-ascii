(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const fileInput = document.getElementById('file');

    const context = canvas.getContext('2d');

    fileInput.onchange = e => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        const image = new Image();
        image.src = event.target.result;

        image.onload = () => {
          const [width, height] = clampDimensions(image.width, image.height);

          canvas.width = width;
          canvas.height = height;

          context.drawImage(image, 0, 0, width, height);
          const grayScales = convertToGrayScale(context, width, height);

          drawAscii(grayScales, width);
        };
      };
    };

    const toGrayScale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const convertToGrayScale = (ctx, width, height) => {
      const imageData = ctx.getImageData(0, 0, width, height);

      const grayScales = [];

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const grayScale = toGrayScale(r, g, b);
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;

        grayScales.push(grayScale);
      }

      ctx.putImageData(imageData, 0, 0);

      return grayScales;
    };

    const getCharacterForGrayValue = grayValue => {
      const grayRamp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
      const rampLength = grayRamp.length;

      return grayRamp[Math.ceil(((rampLength - 1) * grayValue) / 255)];
    };

    const drawAscii = (grayScales, width) => {
      const asciiImage = document.getElementById('ascii');

      const ascii = grayScales.reduce(
        (asciiImage, grayValue, index) =>
          asciiImage +
          getCharacterForGrayValue(grayValue) +
          ((index + 1) % width === 0 ? '\n' : ''),
        ''
      );

      asciiImage.textContent = ascii;
    };

    const clampDimensions = (width, height) => {
      const MAXIMUM_WIDTH = 100;
      const MAXIMUM_HEIGHT = 100;

      if (height > MAXIMUM_HEIGHT) {
        const reducedWidth = Math.floor((width * MAXIMUM_HEIGHT) / height);
        return [reducedWidth, MAXIMUM_HEIGHT];
      }

      if (width > MAXIMUM_WIDTH) {
        const reducedHeight = Math.floor((height * MAXIMUM_WIDTH) / width);
        return [MAXIMUM_WIDTH, reducedHeight];
      }

      return [width, height];

      // selecting the smallest

      // const MAX_SIZE = 150;
      // const aspectRatio = width / height;

      // if (width > height) return [Math.round(MAX_SIZE / aspectRatio), MAX_SIZE];
      // if (width < height) return [MAX_SIZE, Math.round(MAX_SIZE / aspectRatio)];
      // return [MAX_SIZE, MAX_SIZE]; // width == height
    };
  });
})();
