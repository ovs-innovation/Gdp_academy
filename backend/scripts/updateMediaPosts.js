/**
 * Update home page instagramPosts and youtubeShorts in MongoDB
 * Run: node scripts/updateMediaPosts.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const PageContent = require('../models/pageContentModel.js');

const INSTAGRAM_REELS = [
  { reelId: 'DadAKWthgEB', url: 'https://www.instagram.com/reel/DadAKWthgEB/', delay: 0, offset: '0', likes: '', comments: '' },
  { reelId: 'DX4zIElTyh9', url: 'https://www.instagram.com/reel/DX4zIElTyh9/', delay: 0.1, offset: '-30px', likes: '', comments: '' },
  { reelId: 'DXB8VV3CbLc', url: 'https://www.instagram.com/reel/DXB8VV3CbLc/', delay: 0.2, offset: '20px', likes: '', comments: '' },
  { reelId: 'DVBQlWyCeqY', url: 'https://www.instagram.com/reel/DVBQlWyCeqY/', delay: 0.3, offset: '-20px', likes: '', comments: '' },
  { reelId: 'CqPTAdduo6m', url: 'https://www.instagram.com/reel/CqPTAdduo6m/', delay: 0.4, offset: '30px', likes: '', comments: '' },
  { reelId: 'CpfgqWbNvUo', url: 'https://www.instagram.com/reel/CpfgqWbNvUo/', delay: 0.5, offset: '-15px', likes: '', comments: '' },
  { reelId: 'CtayfVrJ174', url: 'https://www.instagram.com/reel/CtayfVrJ174/', delay: 0.6, offset: '10px', likes: '', comments: '' },
];

const YOUTUBE_SHORTS = [
  { vid: 'https://www.youtube.com/embed/t_U6KbVqRDg', ytId: 't_U6KbVqRDg', title: 'Dance Reel 1', views: '', likes: '', delay: 0 },
  { vid: 'https://www.youtube.com/embed/xnvhC3obxHg', ytId: 'xnvhC3obxHg', title: 'Dance Reel 2', views: '', likes: '', delay: 0.1 },
  { vid: 'https://www.youtube.com/embed/OMr8rMSe_GQ', ytId: 'OMr8rMSe_GQ', title: 'Dance Reel 3', views: '', likes: '', delay: 0.2 },
  { vid: 'https://www.youtube.com/embed/wiDo4xWDrdY', ytId: 'wiDo4xWDrdY', title: 'Dance Reel 4', views: '', likes: '', delay: 0.3 },
  { vid: 'https://www.youtube.com/embed/N_M1J_wgKcI', ytId: 'N_M1J_wgKcI', title: 'Dance Reel 5', views: '', likes: '', delay: 0.4 },
  { vid: 'https://www.youtube.com/embed/IyyCJjf8iqM', ytId: 'IyyCJjf8iqM', title: 'Dance Reel 6', views: '', likes: '', delay: 0.5 },
  { vid: 'https://www.youtube.com/embed/t_7IgCxN3kc', ytId: 't_7IgCxN3kc', title: 'Dance Reel 7', views: '', likes: '', delay: 0.6 },
  { vid: 'https://www.youtube.com/embed/ziBaK1q7L2Q', ytId: 'ziBaK1q7L2Q', title: 'Dance Reel 8', views: '', likes: '', delay: 0.7 },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const result = await PageContent.findOneAndUpdate(
    { slug: 'home' },
    {
      $set: {
        'content.instagramPosts': INSTAGRAM_REELS,
        'content.youtubeShorts': YOUTUBE_SHORTS,
      },
    },
    { new: true },
  );

  if (!result) {
    console.error('❌ Home page document not found in DB!');
    process.exit(1);
  }

  console.log('✅ instagramPosts updated:', result.content.instagramPosts.length, 'reels');
  console.log('✅ youtubeShorts updated:', result.content.youtubeShorts.length, 'shorts');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
