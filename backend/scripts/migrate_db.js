import mongoose from 'mongoose';

const OLD_URI = 'mongodb://ovsdeveloper26_db_user:csyoq9rF2htdtiDq@ac-9nayvcr-shard-00-00.97jnm8d.mongodb.net:27017,ac-9nayvcr-shard-00-01.97jnm8d.mongodb.net:27017,ac-9nayvcr-shard-00-02.97jnm8d.mongodb.net:27017/gdp_academy_old?ssl=true&authSource=admin&replicaSet=atlas-mldxhe-shard-0&retryWrites=true&w=majority';
const NEW_URI = 'mongodb://gdpAcademy:gdpdance123@ac-rreiwsx-shard-00-00.tr38jwh.mongodb.net:27017,ac-rreiwsx-shard-00-01.tr38jwh.mongodb.net:27017,ac-rreiwsx-shard-00-02.tr38jwh.mongodb.net:27017/gdpAcademy?ssl=true&authSource=admin&replicaSet=atlas-xji6j1-shard-0&retryWrites=true&w=majority';

async function migrateData() {
  console.log('Starting Migration Process...');
  console.log('DO NOT CANCEL THIS SCRIPT.');

  try {
    // Connect to OLD DB
    console.log('Connecting to Old Database (gdp_academy_old)...');
    const oldDb = await mongoose.createConnection(OLD_URI, { family: 4, serverSelectionTimeoutMS: 10000 }).asPromise();
    console.log('Successfully connected to Old Database.');

    // Connect to NEW DB
    console.log('Connecting to New Database (gdp_academy)...');
    const newDb = await mongoose.createConnection(NEW_URI, { family: 4, serverSelectionTimeoutMS: 10000 }).asPromise();
    console.log('Successfully connected to New Database.');

    // Get all collections from the old database
    const collections = await oldDb.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate.`);

    for (let col of collections) {
      const collectionName = col.name;
      
      // Skip system collections
      if (collectionName.startsWith('system.')) continue;
      
      console.log(`Migrating collection: ${collectionName}...`);
      
      const oldCollection = oldDb.collection(collectionName);
      const newCollection = newDb.collection(collectionName);
      
      const documents = await oldCollection.find({}).toArray();
      
      if (documents.length > 0) {
        // Optional: clear the new collection first to prevent duplicate key errors if script runs multiple times
        await newCollection.deleteMany({});
        await newCollection.insertMany(documents);
        console.log(` -> Copied ${documents.length} documents.`);
      } else {
        console.log(` -> Empty collection, skipped.`);
      }
    }

    console.log('\n===========================================');
    console.log('MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('All data safely copied to the new database.');
    console.log('===========================================');

    await oldDb.close();
    await newDb.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed with error:');
    console.error(error);
    process.exit(1);
  }
}

migrateData();
