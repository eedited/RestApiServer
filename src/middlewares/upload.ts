import AWS from 'aws-sdk';
import multer, { Multer } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

// AWS.config.update({
//     accessKeyId: process.env.S3_ACCESS_KEY_ID,

// })

const s3: AWS.S3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    region: process.env.S3_REGION,
});

type keyCallbackType = (err: Error | null, key?: string) => void
const upload: Multer = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME as string,
        key(req: Express.Request, file: Express.Multer.File, callback: keyCallbackType) {
            callback(null, `original/${Date.now()}-${path.basename(file.originalname)}`);
        },
    }),
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});

export default upload;
