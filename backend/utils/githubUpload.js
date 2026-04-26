const axios = require('axios');
const path = require('path');

/**
 * Uploads a file to a GitHub repository using the GitHub REST API.
 * @param {Buffer} fileBuffer - The buffer of the uploaded file.
 * @param {string} originalname - The original name of the file.
 * @returns {Promise<string>} The raw download URL of the uploaded file.
 */
async function uploadToGitHub(fileBuffer, originalname) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    throw new Error("GitHub credentials not configured in environment variables.");
  }

  // Create a unique filename
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(originalname)}`;
  const filePath = `uploads/${filename}`; // Directory inside the github repo

  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`;
  
  // Convert buffer to base64
  const contentBase64 = fileBuffer.toString('base64');

  try {
    const response = await axios.put(
      url,
      {
        message: `Upload ${filename}`,
        content: contentBase64,
        branch: "main" // Assuming default branch is main, though we could make this configurable
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    // Return the raw download URL
    return response.data.content.download_url;
  } catch (error) {
    console.error("GitHub Upload Error:", error.response?.data || error.message);
    throw new Error(`Failed to upload to GitHub: ${error.response?.data?.message || error.message}`);
  }
}

module.exports = { uploadToGitHub };
