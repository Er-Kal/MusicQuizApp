import express from 'express';
import { submitPlaylist } from '../controllers/playlistController.js';

const router = express.Router();

router.post('/submit-playlist',submitPlaylist);

export default router;