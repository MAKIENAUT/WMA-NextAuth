import clientPromise from '@/app/lib/mongodb';

export async function getUserById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').findOne({ id });
}

export async function updateUserRole(id: string, role: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').updateOne(
    { id },
    { $set: { role } },
    { upsert: false }
  );
}

export async function getAllUsers() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').find().toArray();
}