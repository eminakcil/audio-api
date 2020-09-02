const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ytSearch = require("yt-search");

router.get('/', async function (req, res, next) {
    let videoId = req.query.video_id;

    if (videoId == null || videoId === '') {
        res.json({
            status: 'error',
        });
    }

    let url = `https://www.youtube.com/watch?v=${videoId}`;
    let info = await ytdl.getInfo(url);
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    let audioUrl = audioFormats.find(audioFormat => audioFormat.audioBitrate === 128).url;

    res.json({
        status: 'ok',
        audio_url: audioUrl,
    });
});

router.get('/search', async function (req, res, next) {
    let searchText = req.query.q

    if (searchText == null || searchText === '') {
        res.json({
            status: 'error',
        });
    }

    let results = await ytSearch(searchText)
    let customResults = []

    results.videos.forEach(result => {
        customResults.push({
            id: result.videoId,
            title: result.title,
            thumbnail: result.thumbnail,
            channel: result.author.name,
        });
    });

    res.json({
        status: 'ok',
        results: customResults,
    });
});

module.exports = router;
