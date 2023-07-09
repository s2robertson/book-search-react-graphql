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
router.route('/').post(createUser)
.put(authMiddleware, async (req, res) => {
    // `req.user` is created in the auth middleware function
    const user = req.user;
    const book = req.body;
    try {
        const updatedUser = await saveBook(user, book);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
    
});

router.post('/login', async (req, res) => {
    try {
        const loginDetails = await login(req.body);
        if (loginDetails) {
            res.json(loginDetails);
        } else {
            res.status(400).json({ message: 'Invalid login details' });
        }
    } catch (err) {
        console.error(err);
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
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.delete('/books/:bookId', authMiddleware, async (req, res) => {
    const user = req.user;
    const bookId = req.params.bookId;
    try {
        const updatedUser = await deleteBook(user, bookId);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = router;
