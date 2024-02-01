import express from 'express';
const router = express.Router();

import {showCurrentUser, getAllUsers, getSingleUser, updateUser, updateUserPassword, deleteAccount, followUser, unfollowUser} from '../controllers/user';
import authenticationMiddleware from '../middleware/authentication';

router.route('/').get(getAllUsers);
router.route('/updateUser').patch(authenticationMiddleware, updateUser);
router.route('/updateUserPassword').patch(authenticationMiddleware, updateUserPassword);
router.route('/showCurrentUser').get(authenticationMiddleware, showCurrentUser);
router.route('/deleteAccount').delete(authenticationMiddleware, deleteAccount);
router.route('/:id').get(getSingleUser);
router.route('/:id/followUser').post(authenticationMiddleware, followUser);
router.route('/:id/unfollowUser').delete(authenticationMiddleware, unfollowUser);

export default router;