import { S3Client } from '@aws-sdk/client-s3';

export interface CloudflareConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export class CloudflareR2Storage {
  private client: S3Client;
  private bucket: string;

  constructor(config: CloudflareConfig) {
    this.bucket = config.bucketName;
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async uploadFile(file: Buffer, key: string, contentType: string): Promise<string> {
    const command = {
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    };

    await this.client.send(command);
    return `https://${this.bucket}.${process.env.CLOUDFLARE_CUSTOM_DOMAIN}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const command = {
      Bucket: this.bucket,
      Key: key,
    };

    await this.client.send(command);
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    };

    return await this.client.send(command);
  }
} 