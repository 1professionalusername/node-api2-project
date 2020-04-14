const express = require('express')
const db = require('../data/db')

const router = express.Router()





// GET all 
router.get("/", (req, res) => {
    db.find(req.query)
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})



// POST all
router.post("/", (req, res) => {
    const info = req.body
    if (!info.title || !info.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.insert(info)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the post to the database" })

            })
    }
})




// GET by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            console.log(post)
            if (post.length !== 0) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ errorMessage: "There was an error getting the specific ID." })
            }
        })
        .catch(err => {
            console.log('err');
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})




// Update by ID
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const info = req.body;
    if (!info.title || !info.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db.update(id, info)
            .then(post => {
                if (post) {
                    res.status(200).json(info)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "The post information could not be modified." })
            })
    }
})



// DELETE post by ID
router.delete("/:id", (req, res) => {
    db.remove(req.params.id)
        .then(deleted => {
            if (deleted) {
                res.status(204).json({ deleted })
            } else {
                return res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed" }))
})




// GET all comments for a post id
router.get("/:id/comments", (req, res) => {
    console.log(req.params)
    db.findPostComments(req.params.id)
        .then(comments => {
            if (comments) {
                return res.status(200).json(comments)
            } else {
                return res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})



// [Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: comments.post_id] {
//     errno: 19,
//     code: 'SQLITE_CONSTRAINT'
// }


router.post('/:id/comments', (req, res) => {
    const info = req.body;
    if (!info.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db.insertComment(info)
            .then(comment => {
                if (comment) {
                    res.status(201).json(comment)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }
})




module.exports = router