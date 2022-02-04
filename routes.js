const express = require('express');
const router = express.Router()
const { getDataByTags } = require('./backendData/Hatchways')


//testing API response
//http://localhost:5000/api/ping GET
router.get('/ping', async (req, res) => {
    const jsonRes = {
        "success": true
    }
    res.status(200).json(jsonRes)
})

//http://localhost:5000/api/posts/tech/likes/desc GET
//retrieving all posts then sorting posts by 'markers' in this case (id, reads, likes, and popularity). Then
router.get('/posts/:tags?/:marker?/:order?', async (req, res) => {
    const tags = req.params.tags
    if (typeof tags === 'undefined') {
        res.status(400)
        res.json({
            "error": "Tags parameter is required"
        })
        return
    }
    const marker = req.params.marker
    if (!(['id', 'reads', 'likes', 'popularity'].includes(marker) || typeof marker === 'undefined')) {
        res.status(400)
        res.json({
            "error": "sortBy parameter is invalid"
        })
        return
    }
    const order = req.params.order || 'asc'
    if (!(order === 'asc' || order === 'desc')) {
        res.status(400)
        res.json({
            "error": "sortBy parameter is invalid"
        })
        return
    }
    const tagsArray = tags.split(',')
    const baseApiUrl = 'https://api.hatchways.io/assessment/blog/posts?tag='
    //allows user to give us one or more tags in the list. Take users tags, split the by a comma, then with the tags, generate a list of links with those tags. And then call the function getDataByTags to actually get the data using the url.
    const urls = tagsArray.map(tag => baseApiUrl + tag)
    const allPosts = await getDataByTags(urls)
    const compareNumbers = (a, b) => {
        if (order === 'asc') {
            return a[marker] - b[marker]
        }
        if (order === 'desc') {
            return b[marker] - a[marker]
        }
    }
    allPosts.sort(compareNumbers)
    res.json({ posts: allPosts })
})

module.exports = router