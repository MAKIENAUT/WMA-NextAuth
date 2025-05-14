// app/api/j1-visa-application/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const j1ApplicationsCollection = db.collection('j1_applications');

    // Convert string ID to MongoDB ObjectId
    let query = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch (error) {
      // If ID is not a valid ObjectId format, try matching by string ID
      query = { _id: id };
    }

    const application = await j1ApplicationsCollection.findOne(query);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error('Error fetching J1 visa application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}