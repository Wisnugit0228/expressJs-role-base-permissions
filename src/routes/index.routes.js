import express from 'express';
import { deleteRoleByIdController, editRoleController, getRolesByNameController, getRolesController, postRoleController } from '../controllers/Role.Controller.js';
import { deletePermissionByIdController, editPermissionByIdController, getPermissionsController, postPermissionController } from '../controllers/Permission.Controller.js';
import { deleteRolePermissionByIdController, postRolePermissionController } from '../controllers/RolePermission.Controller.js';
import { getAllUsersController, getUserLoginByIdController, LoginController, LogoutUserController, postUserControlller, refreshTokenController, resendOtpController, verfifyEmailUserController } from '../controllers/User.Controller.js';
import { Authenticate } from '../middlewares/Authentication.js';
import { hasPermission } from '../middlewares/HasPermission.js';
import { addUserController, deleteUserController, getLoginHistoriesController } from '../controllers/SuperAdmin.Controller.js';
import { postUserRoleController } from '../controllers/UserRole.Controller.js';
import { deleteAvatarCOntroller, getProfileController, putAvatarProfileCOntroller, putProfileController } from '../controllers/Profile.Controller.js';
import multer from 'multer';
import { resendOtpResetController, resetpasswordController, sendOtpResetPasswordController, verifyOtpCOntroller } from '../controllers/ResetPassword.Controller.js';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//welcome
router.get('/', (req, res) => {
    res.send('Welcome to the API');
})

//roles routes
router.post('/roles', Authenticate, hasPermission('super admin', 'post'), postRoleController);
router.get('/roles', Authenticate, hasPermission('super admin', 'get'), getRolesController);
router.put('/roles/:id', Authenticate, hasPermission('super admin', 'edit'), editRoleController);
router.get('/roles/search', getRolesByNameController);
router.delete('/roles/:id', Authenticate, hasPermission('super admin', 'delete'), deleteRoleByIdController);

//permissions routes
router.post('/permissions', Authenticate, hasPermission('super admin', 'post'), postPermissionController);
router.get('/permissions', getPermissionsController);
router.put('/permissions/:id', Authenticate, hasPermission('super admin', 'edit'), editPermissionByIdController);
router.delete('/Permissions/:id', Authenticate, hasPermission('super admin', 'delete'), deletePermissionByIdController);

//role-permissions routes
router.post('/role-permissions', Authenticate, hasPermission('super admin', 'post'), postRolePermissionController);
router.delete('/role-permissions/:id', Authenticate, hasPermission('super admin', 'delete'), deleteRolePermissionByIdController);

//users
router.post('/register', postUserControlller);
router.get('/users', Authenticate, hasPermission('super admin', 'get'), getAllUsersController);
router.put('/users/:email', verfifyEmailUserController);
router.put('/resendotp/:email', resendOtpController);

//profile
router.get('/profiles', Authenticate, getProfileController);
router.put('/profiles', Authenticate, upload.single('image'), putProfileController);
router.put('/profiles/avatar', Authenticate, upload.single('image'), putAvatarProfileCOntroller);
router.delete('/profiles/avatar', Authenticate, deleteAvatarCOntroller);

router.post('/Login', LoginController);
router.delete('/logout', LogoutUserController);
router.get('/refresh-token', refreshTokenController);
router.get('/myusers', Authenticate, getUserLoginByIdController);

//super admin
router.post('/add-users', Authenticate, hasPermission('super admin', 'post'), addUserController);
router.post("/user-role", Authenticate, hasPermission('super admin', 'post'), postUserRoleController);
router.delete("/users/:email", Authenticate, hasPermission('super admin', 'delete'), deleteUserController);
router.get('/login-histories', Authenticate, hasPermission('super admin', 'get'), getLoginHistoriesController);

//reset password
router.post('/reset-password', sendOtpResetPasswordController);
router.put('/verify-otp/:email', verifyOtpCOntroller);
router.put('/resend-otp/:email', resendOtpResetController)
router.put('/reset-password', resetpasswordController);



export default router;