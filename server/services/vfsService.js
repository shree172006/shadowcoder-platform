import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import ApiError from '../utils/ApiError.js';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'scenarios');

// Ensure base upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Stream-extract an uploaded ZIP archive to target directory without memory overload.
 *
 * @param {string} zipFilePath - Path to temp uploaded ZIP file
 * @param {string} targetDirName - Unique directory name for scenario codebase
 * @returns {Promise<string>} Target extraction path
 */
export const extractZipStream = async (zipFilePath, targetDirName) => {
  const targetPath = path.join(UPLOADS_DIR, targetDirName);

  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  fs.mkdirSync(targetPath, { recursive: true });

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: targetPath }))
      .on('close', () => {
        // Cleanup temp zip file
        if (fs.existsSync(zipFilePath)) {
          fs.unlinkSync(zipFilePath);
        }
        resolve(targetPath);
      })
      .on('error', (err) => {
        if (fs.existsSync(zipFilePath)) {
          fs.unlinkSync(zipFilePath);
        }
        reject(ApiError.internal(`Failed to extract codebase archive stream: ${err.message}`));
      });
  });
};

/**
 * Generates hierarchical VFS (Virtual File System) JSON tree structure from directory.
 *
 * @param {string} dirPath - Directory path
 * @param {string} relativeRoot - Relative root accumulator
 * @returns {Array<Object>} VFS Node Array
 */
export const buildVfsTree = (dirPath, relativeRoot = '') => {
  if (!fs.existsSync(dirPath)) return [];

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes = [];

  // Filter out node_modules, .git, and dist folders to keep VFS clean
  const IGNORED_NAMES = ['.git', 'node_modules', 'dist', '.DS_Store', '__pycache__'];

  for (const item of items) {
    if (IGNORED_NAMES.includes(item.name)) continue;

    const itemRelativePath = relativeRoot ? `${relativeRoot}/${item.name}` : item.name;
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      nodes.push({
        name: item.name,
        path: itemRelativePath,
        type: 'directory',
        children: buildVfsTree(fullPath, itemRelativePath),
      });
    } else {
      const stats = fs.statSync(fullPath);
      nodes.push({
        name: item.name,
        path: itemRelativePath,
        type: 'file',
        size: stats.size,
        extension: path.extname(item.name).replace('.', ''),
      });
    }
  }

  // Sort: directories first, then files alphabetically
  return nodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
};

/**
 * Reads a single file from the VFS target path using readable streams.
 *
 * @param {string} baseDirPath - Base scenario directory
 * @param {string} relativeFilePath - Relative path to target file
 * @returns {Promise<string>} File content
 */
export const readVfsFileStream = async (baseDirPath, relativeFilePath) => {
  const safePath = path.normalize(path.join(baseDirPath, relativeFilePath));

  // Security check: Prevent Path Traversal attacks (RCE / file leaks outside base directory)
  if (!safePath.startsWith(path.normalize(baseDirPath))) {
    throw ApiError.forbidden('Forbidden path traversal attempt detected');
  }

  if (!fs.existsSync(safePath)) {
    throw ApiError.notFound(`File '${relativeFilePath}' does not exist in scenario VFS`);
  }

  return fs.promises.readFile(safePath, 'utf-8');
};

/**
 * Writes updated content to a file in VFS workspace safely.
 *
 * @param {string} baseDirPath - Base scenario directory
 * @param {string} relativeFilePath - Relative path to file
 * @param {string} content - New file content
 */
export const writeVfsFile = async (baseDirPath, relativeFilePath, content) => {
  const safePath = path.normalize(path.join(baseDirPath, relativeFilePath));

  if (!safePath.startsWith(path.normalize(baseDirPath))) {
    throw ApiError.forbidden('Forbidden path traversal attempt detected');
  }

  const dirName = path.dirname(safePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  await fs.promises.writeFile(safePath, content, 'utf-8');
};
