import fs from "fs";
import path from "path";

//Get all files in a folder using NodeJs
//recursive function to get files
export const getAllFiles = (folderPath: string) => {
	let response: string[] = [];
	// readdirSync lets you read all the content of the directory
	const allFilesAndFolders = fs.readdirSync(folderPath);
	allFilesAndFolders.forEach((file) => {
		const fullFilePath = path.join(folderPath, file);
		if (fs.statSync(fullFilePath).isDirectory()) {
			response = response.concat(getAllFiles(fullFilePath));
		} else {
			response.push(fullFilePath);
		}
	});
	return response;
};
