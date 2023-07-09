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

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.params.id;
        const user = await getSingleUser(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(400).json({ message: `Cannot find user with id ${userId}` });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.route('/books/:bookId').delete(authMiddleware, deleteBook);

module.exports = router;
