require('dotenv').config();
const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing songs, albums, artists
    await Song.deleteMany({});
    await Album.deleteMany({});
    await Artist.deleteMany({});
    console.log('🗑️  Cleared old data');

    // Create 3 artists
    const artists = await Artist.insertMany([
        { name: 'Daft Punk', genre: 'Electronic', bio: 'French electronic duo' },
        { name: 'Queen', genre: 'Rock', bio: 'British rock legends' },
        { name: 'The Weeknd', genre: 'Pop', bio: 'Canadian R&B artist' },
    ]);

    // Create 3 albums (one per artist)
    const albums = await Album.insertMany([
        { title: 'Discovery', releaseYear: 2001, artist: artists[0]._id },
        { title: 'A Night at the Opera', releaseYear: 1975, artist: artists[1]._id },
        { title: 'After Hours', releaseYear: 2020, artist: artists[2]._id },
    ]);

    // Create 15 songs spread across artists and albums
    const songData = [
        { title: 'One More Time', duration: 320, artist: artists[0]._id, album: albums[0]._id },
        { title: 'Harder Better Faster', duration: 224, artist: artists[0]._id, album: albums[0]._id },
        { title: 'Around the World', duration: 428, artist: artists[0]._id, album: albums[0]._id },
        { title: 'Digital Love', duration: 301, artist: artists[0]._id, album: albums[0]._id },
        { title: 'Face to Face', duration: 273, artist: artists[0]._id, album: albums[0]._id },

        { title: 'Bohemian Rhapsody', duration: 354, artist: artists[1]._id, album: albums[1]._id },
        { title: 'You\'re My Best Friend', duration: 170, artist: artists[1]._id, album: albums[1]._id },
        { title: "Don't Stop Me Now", duration: 210, artist: artists[1]._id, album: albums[1]._id },
        { title: 'Somebody to Love', duration: 292, artist: artists[1]._id, album: albums[1]._id },
        { title: 'We Will Rock You', duration: 122, artist: artists[1]._id, album: albums[1]._id },

        { title: 'Blinding Lights', duration: 200, artist: artists[2]._id, album: albums[2]._id },
        { title: 'Save Your Tears', duration: 215, artist: artists[2]._id, album: albums[2]._id },
        { title: 'In Your Eyes', duration: 238, artist: artists[2]._id, album: albums[2]._id },
        { title: 'Heartless', duration: 186, artist: artists[2]._id, album: albums[2]._id },
        { title: 'After Hours', duration: 361, artist: artists[2]._id, album: albums[2]._id },
    ];

    await Song.insertMany(songData);
    console.log('🎵 Seeded 15 songs successfully!');
    console.log('\nNow test pagination:');
    console.log('  GET http://localhost:5000/api/songs?limit=5  (first page)');
    console.log('  GET http://localhost:5000/api/songs?cursor=<nextCursor>&limit=5  (next page)');

    await mongoose.connection.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
