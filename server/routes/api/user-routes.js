const router = require('express').Router();
const {
    createUser,
    getSingleUser,
    saveBook,
    deleteBook,
    login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authMiddleware, saveBook);

router.post('/login', async (req, res) => {
    try {
        const loginDetails = await login(req.body);
        if (loginDetails) {
            res.json(loginDetails);
        } else {
            res.status(400).json({ message: 'Invalid login details' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
})

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/books/:bookId').delete(authMiddleware, deleteBook);

module.exports = router;
