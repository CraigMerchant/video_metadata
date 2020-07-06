const express = require("express");
const ffprobe = require("ffprobe");
const ffprobeStatic = require("ffprobe-static");
const genThumbnail = require("simple-thumbnail");

const app = express();
const port = process.env.PORT || 3000;
const thumbnail_size = "500x?";
const thumbnail_timecode = "00:00:00";

app.get("/", (req, res) => res.send(" "));

app.get("/metadata", function(req, res) {
    if (!req.query.url) {
        res.status(500);
        res.send("no url specified");
    } else {
        try {
            ffprobe(req.query.url, { path: ffprobeStatic.path }, function(
                err,
                info
            ) {
                if (err) {
                    res.status(500);
                    res.send(err);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(info));
                }
            });
        } catch (error) {
            res.status(500);
            res.send(error);
        }
    }
});

app.get("/thumbnail", function(req, res) {
    if (!req.query.url) {
        res.status(500);
        res.send("no url specified");
    } else {
        var seek = thumbnail_timecode;

        if (req.query.time) {
            seek = req.query.time;
        }

        genThumbnail(req.query.url, res, thumbnail_size, {
            seek,
        }).catch((err) => {
            res.status(500);
            res.send(err);
        });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
