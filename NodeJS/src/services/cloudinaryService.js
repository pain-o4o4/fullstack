import cloudinary from '../config/cloudinary';

/**
 * Uploads a base64 string image or a file buffer to Cloudinary.
 * @param {string} base64Str - The base64 string of the image (with or without data:image/ prefix)
 * @param {string} folder - Optional folder name in Cloudinary (e.g. 'users', 'clinics', 'specialties')
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadToCloudinary = async (base64Str, folder = 'bookingcare') => {
    try {
        if (!base64Str) return '';
        
        // If it's already a URL (e.g. from an existing Cloudinary upload or external link), just return it
        if (base64Str.startsWith('http://') || base64Str.startsWith('https://')) {
            return base64Str;
        }

        // Prepare base64 string format for Cloudinary
        let formatStr = base64Str;
        if (!base64Str.startsWith('data:image/')) {
            // Assume it is jpeg/png base64 format and prepend standard prefix
            formatStr = `data:image/png;base64,${base64Str}`;
        }

        const uploadResponse = await cloudinary.uploader.upload(formatStr, {
            folder: folder,
            // Automatic optimization settings: auto format and quality
            transformation: [
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return uploadResponse.secure_url;
    } catch (error) {
        console.error(">>> [Cloudinary] Error uploading image: ", error);
        throw error;
    }
};

/**
 * Extracts the Cloudinary public_id from a secure_url.
 * Example: "https://res.cloudinary.com/dg62u2v4c/image/upload/v123/users/abc.jpg"
 *       → public_id = "users/abc"
 */
const extractPublicId = (url) => {
    try {
        if (!url || !url.includes('cloudinary.com')) return null;
        // Pattern: .../upload/v<numbers>/<folder>/<filename>.<ext>
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
};

/**
 * Deletes an image from Cloudinary by its URL.
 * Silently fails if the URL is invalid or deletion fails (non-blocking).
 * @param {string} imageUrl - The Cloudinary secure_url to delete
 */
const deleteFromCloudinary = async (imageUrl) => {
    try {
        const publicId = extractPublicId(imageUrl);
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        // Non-blocking: log but don't throw — old image cleanup is best-effort
        console.warn(">>> [Cloudinary] Could not delete old image:", error.message);
    }
};

export default {
    uploadToCloudinary,
    deleteFromCloudinary
};
