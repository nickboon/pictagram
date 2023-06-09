import express from 'express';
import { post } from '../userController.js';

export default function (app) {
	app.use(express.json());
	app.post('/signup', post.signup);
	app.post('/login', post.login);
}
