import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export default function (app) {
	const startupDir = path.dirname(fileURLToPath(import.meta.url));
	app.use(express.static(path.join(startupDir, '..', 'public')));
}
