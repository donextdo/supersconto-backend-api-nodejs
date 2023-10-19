const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const dotenv = require('dotenv');
dotenv.config();
const FileService = module.exports;

FileService.uploadFile = async function(request, response, next) {
    try {

        const client = new S3Client({
            credentials: {
                accessKeyId: 'AKIA3DERVBVL472ESK54',
                secretAccessKey: '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',
            },
             region: 'eu-west-3',
        });

        const fileName = `${Date.now().toString()}-${request.file.originalname}`;

        const parallelUploads3 = new Upload({
            client: client,
            tags: [],
            queueSize: 4,
            leavePartsOnError: false,
            params: {
                //ACL: 'public-read',
                Bucket: 'supersconto-images-bucket',
                Key: fileName,
                Body: request.file.buffer,
            },
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {});

        await parallelUploads3.done();
        
        return fileName;
        // return response.status(200).json({
        //     error: false,
        //     message: 'File uploaded',
        //     data: {
        //         file_url: `${process.env.AWS_S3_BASEURL}/${fileName}`
        //     },
        // });
    } catch (error) {
        return response.status(400).json({
            error: true,
            message: 'Something went wrong',
            data: error,
        });
    }
}
