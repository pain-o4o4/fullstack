import cloudinaryConfig from '../config/cloudinary';

/**
 * Parses an image value fetched from the database.
 * All image data in DB is now stored as Cloudinary URLs.
 * Sequelize returns BLOB columns as Buffers, so we convert to UTF-8 string.
 * 
 * @param {any} dbImage - The image data from Sequelize (Buffer, string, or null)
 * @returns {string} - The Cloudinary URL string
 */
export const parseImageFromDb = (dbImage) => {
    if (!dbImage) return '';

    // If it's already a string URL, return directly
    if (typeof dbImage === 'string') return dbImage;

    // If it's a Buffer (Sequelize BLOB type), convert to UTF-8 string (URL)
    if (Buffer.isBuffer(dbImage)) return dbImage.toString('utf-8');

    return '';
};

/**
 * Safely uploads an image input (Base64 string) to Cloudinary.
 * If input is already a URL or empty, it returns it as-is.
 * 
 * @param {string} imageInput - The Base64 string from the frontend
 * @param {string} folder - The folder destination in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (imageInput, folder = 'bookingcare') => {
    if (!imageInput) return '';
    
    // If it's already a URL, return it directly
    if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
        return imageInput;
    }

    // Otherwise upload it
    return await cloudinaryConfig.uploadToCloudinary(imageInput, folder);
};

/**
 * Replaces an image on Cloudinary: deletes the old one, uploads the new one.
 * If newImageInput is the same URL as oldImageUrl, no action is taken.
 * 
 * @param {string} newImageInput - The new image (base64 from frontend or URL)
 * @param {string} oldImageUrl - The current Cloudinary URL stored in DB
 * @param {string} folder - The folder destination in Cloudinary
 * @returns {Promise<string>} - The new secure URL
 */
export const replaceImageOnCloudinary = async (newImageInput, oldImageUrl, folder = 'bookingcare') => {
    if (!newImageInput) return oldImageUrl || '';

    // If the new input is the same URL as old, no change needed
    if (newImageInput === oldImageUrl) return oldImageUrl;

    // If the new input is already a different URL (not base64), just return it
    if (newImageInput.startsWith('http://') || newImageInput.startsWith('https://')) {
        return newImageInput;
    }

    // Upload new image first (ensure success before deleting old)
    const newUrl = await cloudinaryConfig.uploadToCloudinary(newImageInput, folder);

    // Delete old image from Cloudinary (best-effort, non-blocking)
    if (oldImageUrl) {
        const oldUrlStr = typeof oldImageUrl === 'string' 
            ? oldImageUrl 
            : (Buffer.isBuffer(oldImageUrl) ? oldImageUrl.toString('utf-8') : '');
        if (oldUrlStr.startsWith('http')) {
            await cloudinaryConfig.deleteFromCloudinary(oldUrlStr);
        }
    }

    return newUrl;
};

/**
 * Deletes an image from Cloudinary by its URL (for record deletion use cases).
 * @param {string} imageUrl - The Cloudinary URL to delete
 */
export const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    const urlStr = typeof imageUrl === 'string'
        ? imageUrl
        : (Buffer.isBuffer(imageUrl) ? imageUrl.toString('utf-8') : '');
    if (urlStr.startsWith('http')) {
        await cloudinaryConfig.deleteFromCloudinary(urlStr);
    }
};

export default {
    parseImageFromDb,
    uploadImageToCloudinary,
    replaceImageOnCloudinary,
    deleteImageFromCloudinary
};
