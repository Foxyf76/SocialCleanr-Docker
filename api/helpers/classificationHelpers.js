const vision = require('@google-cloud/vision');
const { loadImage, createCanvas } = require('canvas');
const axios = require('axios');
const sharp = require('sharp');
const client = new vision.ImageAnnotatorClient();
const helpers = require('./generalHelpers');
const fs = require('fs');

/**
 * Convert imageURL into tensor which Tensorflow recognises
 * @param {string} imageURL - URL of image to convert
 * @return {object} Tensor object
 */

const getTensor3dObject = async imageURL => {
  let req = await axios.get(imageURL, {
    responseType: 'arraybuffer'
  });
  // 3 = jpg, 4 = png
  return tf.node.decodeJpeg(req.data, 3);
};

/**
 * Create canvas element with image drawn on
 * @param {string} base64Image - Base64 string of image to draw on
 * @return {Canvas} Canvas element that can be used to draw bbox on
 */

const createCanvasImage = async base64Image => {
  let image = await loadImage(base64Image);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
};

/**
 * Calculate highest scores via list of scores from gesture detection response
 * @param {array} scores - List of scores from prediction
 * @param {integer} numBoxes - Max number of boxes to return from prediction
 * @param {integer} numClasses - Number of classes (labels of gestures)
 * @returns {array} Array containing max scores and indexes of classes
 */

const calculateMaxScores = (scores, numBoxes, numClasses) => {
  const maxes = [];
  const classes = [];
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE;
    let index = -1;
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j];
        index = j;
      }
    }
    maxes[i] = max;
    classes[i] = index;
  }
  return [maxes, classes];
};

/**
 * Build detected object with its bounding box, score and class
 * @param {integer} width - Width of tensor object created from image
 * @param {integer} height - Height of tensor object created from image
 * @param {array} boxes - List of bounding boxes to be drawn onto image
 * @param {array} scores - List of scores (prediction estimates) to assign to each bounding box
 * @param {array} indexes - A Tensor array of image representing the selected indices from the boxes tensor
 * @param {array} boxes - List of bounding boxes to be drawn onto image
 * @param {array} classes - Labels of each class to assign
 * @returns {object} Object containing prediction score, class and bbox coordinates
 */

const buildDetectedObjects = (
  width,
  height,
  boxes,
  scores,
  indices,
  classes
) => {
  const count = indices.length;
  const objects = [];
  for (let i = 0; i < count; i++) {
    const bbox = [];
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indices[i] * 4 + j];
    }
    const minY = bbox[0] * height;
    const minX = bbox[1] * width;
    const maxY = bbox[2] * height;
    const maxX = bbox[3] * width;
    bbox[0] = minX;
    bbox[1] = minY;
    bbox[2] = maxX - minX;
    bbox[3] = maxY - minY;
    objects.push({
      bbox: bbox,
      class: 'middle_finger',
      score: scores[indices[i]]
    });
  }
  return objects;
};

/**
 * Create multiple images from list bounding boxes by extracting regions using box coordinates
 * @param {array} boxArray - Array of bounding boxes, each with 4 coordinates
 * @param {string} image - Base64 string of image to be broken into sub images
 * @returns {array} images - List of extracted images as base64 strings
 */

const boundingBoxesToImage = async (boxArray, image) => {
  let images = [];
  let base64 = image.toDataURL();
  let base64Stripped = base64.split(',')[1];
  let buff = Buffer.from(base64Stripped, 'base64');

  await helpers.asyncForEach(boxArray, async boxes => {
    // If left + width exceeds image width, adjust width
    if (boxes[0] + boxes[2] > image.width) {
      let adjustedWidth = boxes[0] + boxes[2] - image.width;
      boxes[2] = boxes[2] - adjustedWidth;
    }

    if (boxes[1] + boxes[3] > image.height) {
      let adjustedHeight = boxes[1] + boxes[3] - image.height;
      boxes[3] = boxes[3] - adjustedHeight;
    }

    let imageBuffer = await sharp(buff)
      .extract({
        // need to check width and height
        left: boxes[0],
        top: boxes[1],
        width: boxes[2],
        height: boxes[3]
      })
      .toFormat('png')
      .toBuffer();

    // append data header to base64 string
    let encodedImage =
      'data:image/jpeg;base64,' + imageBuffer.toString('base64');
    images.push({ image: imageBuffer, bbox: boxes });

    // for debugging, to see what image is created
    // fs.writeFile(`image_${boxes[0]}.png`, imageBuffer, function(err) {
    //   if (err) throw err;
    // });
  });

  return images;
};

/**
 * Extract text from images using Google Cloud Vision's OCR
 * @param {string} image - Base64 or URL of image to be converted to text
 * @returns {array} List of extracted words and their bounding boxes
 */

const convertToText = async image => {
  let text = [];
  let request = {};

  // if URL or base64 string
  if (image.substring(0, 4) === 'http') {
    request = {
      image: {
        source: {
          imageUri: image
        }
      }
    };
  } else {
    // remove 'data:image/jpeg;base64,' from string
    const base64result = image.split(',')[1];

    request = {
      image: {
        content: base64result
      }
    };
  }

  const [result] = await client.textDetection(request);
  const detections = await result.textAnnotations;

  if (detections.length !== 0) {
    // skip first item in array, this is the full text
    for (let i = 1; i < detections.length; i++) {
      let vertices = detections[i].boundingPoly.vertices;
      // convert 8 vertices into bbox format
      let bbox = [
        vertices[0].x,
        vertices[0].y,
        vertices[2].x - vertices[0].x,
        vertices[2].y - vertices[0].y
      ];

      text.push({ word: detections[i].description, bbox: bbox });
    }
  } else {
    console.log('No text detected');
  }

  return text;
};

module.exports = {
  getTensor3dObject,
  createCanvasImage,
  calculateMaxScores,
  buildDetectedObjects,
  boundingBoxesToImage,
  convertToText
};
