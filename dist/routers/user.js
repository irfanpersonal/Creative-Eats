"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const authentication_1 = __importDefault(require("../middleware/authentication"));
router.route('/').get(user_1.getAllUsers);
router.route('/updateUser').patch(authentication_1.default, user_1.updateUser);
router.route('/updateUserPassword').patch(authentication_1.default, user_1.updateUserPassword);
router.route('/showCurrentUser').get(authentication_1.default, user_1.showCurrentUser);
router.route('/deleteAccount').delete(authentication_1.default, user_1.deleteAccount);
router.route('/:id').get(user_1.getSingleUser);
router.route('/:id/followUser').post(authentication_1.default, user_1.followUser);
router.route('/:id/unfollowUser').delete(authentication_1.default, user_1.unfollowUser);
exports.default = router;
