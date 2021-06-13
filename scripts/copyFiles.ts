import fs from "fs"
import path from "path"
import { promisify } from "util"

const pCopyFile = promisify(fs.copyFile);
const root = path.resolve(__dirname, "../");
const dest = path.resolve(root, "bin");

const filesToCopy = [
	"package.json",
	"package-lock.json",
	".env"
];

const start = async () => {
	for (const file of filesToCopy) {
		const fullSource = path.resolve(root, file);
		const fullDest = path.resolve(dest, file);
		console.log(`Copy ${fullSource} -> ${fullDest}`);
		await pCopyFile(fullSource, fullDest);
	}
};

start().catch((error) => {
	console.error(error);
	process.exit(1);
});