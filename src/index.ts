
import express from "express";

const app = express();
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    res.json({
        id: ""
    })

});


app.listen(3000);