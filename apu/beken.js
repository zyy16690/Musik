// File: /api/audio.js
const ytdl = require('ytdl-core');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL diperlukan' });
  }

  try {
    // Get video info
    const info = await ytdl.getInfo(url);
    
    // Find best audio format
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    if (!audioFormat) {
      return res.status(404).json({ error: 'Format audio tidak ditemukan' });
    }

    // Get stream URL
    const audioUrl = audioFormat.url;

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      audioUrl: audioUrl,
      duration: info.videoDetails.lengthSeconds,
      channel: info.videoDetails.author.name
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Gagal mendapatkan audio' });
  }
      }
