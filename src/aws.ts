import { S3 } from 'aws-sdk';
import fs from 'fs';

const s3 = new S3({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	endpoint: process.env.END_POINT,
});

// Uploading files to the R2/S3 bucket (R2 in case of Cloudflare & S3 for AWS)
//fileName --> output/18jhg2/src/App.tsx (complete path where you want the final files to get stored in S3)
//filePath --> /Users/vikrantsingh/cloud9/dist/output/18jhg2/src/App.tsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
	console.log(
		'uploadFile called with fileName:',
		fileName,
		'and localFilePath:',
		localFilePath
	);
	try {
		const fileContent = fs.readFileSync(localFilePath);
		console.log('File content read successfully');
		const response = await s3
			.upload({
				Body: fileContent,
				Bucket: 'cloud9',
				Key: fileName,
			})
			.promise();
		console.log('File uploaded successfully:', response);
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
};
