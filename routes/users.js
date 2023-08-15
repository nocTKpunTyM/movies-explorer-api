const router = require('express').Router();

const { updateUserValidation, updateAvatarValidation, userIdValidation } = require('../middlewares/celebrate');

const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserId,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', userIdValidation, getUserId);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
