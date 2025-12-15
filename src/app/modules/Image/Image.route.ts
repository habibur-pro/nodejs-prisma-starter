import { Router } from 'express';
import { imageController } from './Image.controller';
import fileUploaderCloud from '../../../helpars/fileUploaderCloud';

const router = Router();

// create image
router.post(
  '/upload',
  fileUploaderCloud.upload.single('image'),
  imageController.createImage
);

// create multiple images
router.post(
  '/upload-multiple',
  fileUploaderCloud.upload.array('images'),
  imageController.createMultipleImages
);

// delete image
router.delete('/delete', imageController.deleteImage);

// delete multiple images
router.delete('/delete-multiple', imageController.deleteMultipleImage);

export const imageRoutes = router;
