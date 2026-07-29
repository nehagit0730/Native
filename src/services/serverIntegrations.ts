import { neon } from '@neondatabase/serverless';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Lazy-initialized Neon PostgreSQL SQL query executor.
 * Gracefully returns null if DATABASE_URL is not set.
 */
export function getNeonSql() {
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  try {
    return neon(dbUrl);
  } catch (err) {
    console.error('Failed to initialize Neon SQL client:', err);
    return null;
  }
}

/**
 * Lazy-initialized Cloudinary Client.
 * Gracefully returns null if Cloudinary environment variables are missing.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return cloudinary;
  } catch (err) {
    console.error('Failed to configure Cloudinary:', err);
    return null;
  }
}
