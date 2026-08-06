import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatarHandler,
  removeAvatar,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../controllers/profileController.js';
import { protect } from '../../middleware/auth.js';
import { uploadAvatar } from '../../middleware/upload.js';
import { validate } from '../../middleware/index.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
} from '../../validations/profile.js';

const router = Router();

router.use(protect);

router.get('/me', getProfile);
router.patch('/me', validate(updateProfileSchema), updateProfile);
router.post('/avatar', uploadAvatar, uploadAvatarHandler);
router.delete('/avatar', removeAvatar);
router.patch('/change-password', validate(changePasswordSchema), changePassword);

router.get('/addresses', getAddresses);
router.post('/addresses', validate(addressSchema), createAddress);
router.patch('/addresses/:addressId', validate(addressSchema), updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.patch('/addresses/:addressId/default', setDefaultAddress);

export default router;
