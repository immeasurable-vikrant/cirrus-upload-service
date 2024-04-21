import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateId } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
import fs from 'fs';
//we need to initialize a publisher, something that can publish to Redix
const publisher = createClient();
publisher.connect()

const subscriber = createClient();
subscriber.connect();


const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    
    try {
        // Generate unique id for the deployment
        const id = generateId();
        const outputDir = path.join(__dirname, `output/${id}`);

        // Clone the repository to a temporary directory
        await simpleGit().clone(repoUrl, outputDir);

        // Check if output directory exists, if not, create it
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // AWS - SDK ( Uploading files to S3 bucket) -
        // we dont have something like - sdk.uploadDirToS3(`output${id}`)
        // but we can easily do  sdk.uploadFiles() like :
        // ["/vikrant/users/project/cloud9/output/1232/app.tsx"]

        // Get all files from the cloned repository
        const files = getAllFiles(outputDir);
       
        //uploading "files" to the S3 bucket
        files.forEach(async (file) => {
            console.log("file-->",file.slice(__dirname.length + 1) )
            await uploadFile(file.slice(__dirname.length + 1), file);
        })
        
        // put this to S3
        publisher.lPush("build-queue", id);
        // INSERT => SQL
        // .create => 
        publisher.hSet("status", id, "uploaded");
        res.json({
            id: id,
        });
        
    } catch (error) {
        console.error("Error during deployment:", error);
        res.status(500).json({ error: "Failed to deploy the repository." });
    }
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

