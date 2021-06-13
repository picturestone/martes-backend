import fs from "fs"
import path from "path"
import { promisify } from "util"

const pCopyFile = promisify(fs.copyFile);
const root = path.resolve(__dirname, "../");
const src = path.resolve(root, process.argv[2]);
const dst = path.resolve(root, process.argv[3]);

const filesToCopy = [
	"database.db"
];

const start = async () => {
	if(!fs.existsSync(dst)) {
		fs.mkdirSync(dst);
	}
	for (const file of filesToCopy) {
		const fullSource = path.resolve(src, file);
		console.log('##########');
		console.log(fullSource);
		if(fs.existsSync(fullSource)) {
			const fullDest = path.resolve(dst, file);
			console.log(`Copy ${fullSource} -> ${fullDest}`);
			await pCopyFile(fullSource, fullDest);
		}
	}
};

start().catch((error) => {
	console.error(error);
	process.exit(1);
});