import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hash, compare } from 'bcrypt';

export async function getUserById(id: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  
  // Try to find by string ID first
  let user = await db.collection('users').findOne({ id });
  
  // If not found, try to find by ObjectId
  if (!user) {
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error converting to ObjectId:', error);
    }
  }
  
  return user;
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').findOne({ email });
}

export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  emailVerified?: boolean;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  
  // Hash the password
  const hashedPassword = await hash(userData.password, 10);
  
  const result = await db.collection('users').insertOne({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    emailVerified: userData.emailVerified || false,
    role: 'user',
    isAllowedDashboard: false,
    createdAt: new Date()
  });
  
  return result;
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

export async function verifyUserEmail(email: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').updateOne(
    { email },
    { $set: { emailVerified: true } }
  );
}

export async function comparePassword(plainPassword: string, hashedPassword: string) {
  return compare(plainPassword, hashedPassword);
}

export async function getAllUsers() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  return db.collection('users').find().toArray();
}