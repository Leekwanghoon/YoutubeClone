const express = require('express');
const router = express.Router();

const { Video } = require("../models/Video");

const multer = require('multer');
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');
//=================================
//             Video
//=================================
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")


router.post('/uploadfiles', (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/thumbnail', (req, res) => {

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    //썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            console.log(err);
            return res.json({ success: false, err })
        })
        .screenshot({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })
})


router.post('/uploadVideo', (req, res) => {

    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) return res.status(400).json({ success: false });
        return res.status(200).json({ success: true })
    })
})
router.get('/getVideos', (req, res) => {

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videos })
        })
})


router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id": req.body.videoId })
        .populate("writer")
        .exec((err, video) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({
                success: true,
                video
            })
        })
})


router.post('/getSubscriptionVideos', (req, res) => {

    Subscriber.find({ 'userFrom': req.body.userFrom })
        .exec((err, SubscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = [];

            SubscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
            })


            // 찾은 사람들의 비디오를 가지고온다
            //req.body._id는 1명 아래처럼 여러명
            Video.find({ writer: { $in: subscribedUser } })
                .populate('writer') //write의 다른 정보도 가져와
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err)
                    return res.status(200).json({ success: true, videos })
                })
        })
})





module.exports = router;
