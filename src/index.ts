import express from "express";
import cors from "cors";
import path from "path";
import simpleGit from "simple-git";
import { generateId } from "./utils";
import { getAllFiles } from "./file";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
	const repoUrl = req.body.repoUrl;
	// Clone function which lets us clone this ("repoUrl") that we're expecting as an input from the user
	await simpleGit().clone(repoUrl);
	const id = generateId();

    // AWS - SDK ( Uploading files to S3 bucket) -
	// we dont have something like - sdk.uploadDirToS3(`output${id}`)
	// but we can easily do  sdk.uploadFiles() like :
	// ["/vikrant/users/project/cloud9/output/1232/app.tsx"]
	const files = getAllFiles(path.join(__dirname, `output/${id}`));


	console.log(files);
    //put this to S3
	res.json({
		id: id,
	});

	
});

app.listen(3000);