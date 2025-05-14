// app/api/j1-visa-application/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    // Handle form data
    const formData = await req.formData();
    
    // Extract text fields
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const full_address = formData.get('full_address') as string;
    const country = formData.get('country') as string;
    const phone_number = formData.get('phone_number') as string;
    const email_address = formData.get('email_address') as string;
    const profession = formData.get('profession') as string;
    const other_profession = formData.get('other_profession') as string || '';
    const confirm_eligibility = formData.get('confirm_eligibility') as string;
    const terms_and_condition = formData.get('terms_and_condition') === 'true';
    
    // Validate required fields
    if (!first_name || !last_name || !full_address || !country || !phone_number || 
        !email_address || !profession || !confirm_eligibility) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if profession is "Other" and other_profession is required
    if (profession === 'Other' && !other_profession) {
      return NextResponse.json(
        { error: 'Please specify your profession' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_address)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const j1ApplicationsCollection = db.collection('j1_applications');
    
    // Create application ID using first and last names
    const applicationId = `${first_name.toLowerCase()}_${last_name.toLowerCase()}_${uuidv4().slice(0, 8)}`;
    
    // Handle file uploads
    const resumeFile = formData.get('resume') as File;
    const passportFile = formData.get('passport') as File;
    
    // Validate file presence
    if (!resumeFile || !passportFile) {
      return NextResponse.json(
        { error: 'Both resume and passport files are required' },
        { status: 400 }
      );
    }
    
    // Validate file types (allow PDF, DOC, DOCX for resume and PDF, JPG, PNG for passport)
    const allowedResumeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedPassportTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedResumeTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Resume must be in PDF, DOC, or DOCX format' },
        { status: 400 }
      );
    }
    
    if (!allowedPassportTypes.includes(passportFile.type)) {
      return NextResponse.json(
        { error: 'Passport must be in PDF, JPG, or PNG format' },
        { status: 400 }
      );
    }
    
    let resumePath = null;
    let passportPath = null;
    
    try {
      // Create directory structure: public/forms/j1/{applicationId}
      const userDir = join(process.cwd(), 'public', 'forms', 'j1', applicationId);
      await mkdir(userDir, { recursive: true });
      
      // Get file extensions from MIME types
      const getExtension = (file: File) => {
        const mimeToExt: Record<string, string> = {
          'application/pdf': '.pdf',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
          'image/jpeg': '.jpg',
          'image/jpg': '.jpg',
          'image/png': '.png'
        };
        return mimeToExt[file.type] || '';
      };
      
      // Save resume file
      const resumeExt = getExtension(resumeFile);
      const resumeName = `resume_${Date.now()}${resumeExt}`;
      const resumeDest = join(userDir, resumeName);
      const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(resumeDest, resumeBuffer);
      resumePath = `/forms/j1/${applicationId}/${resumeName}`;
      
      // Save passport file
      const passportExt = getExtension(passportFile);
      const passportName = `passport_${Date.now()}${passportExt}`;
      const passportDest = join(userDir, passportName);
      const passportBuffer = Buffer.from(await passportFile.arrayBuffer());
      await writeFile(passportDest, passportBuffer);
      passportPath = `/forms/j1/${applicationId}/${passportName}`;
    } catch (err) {
      console.error('Error saving files:', err);
      return NextResponse.json(
        { error: 'Error saving uploaded files' },
        { status: 500 }
      );
    }
    
    // Create new application record
    const applicationData = {
      applicationId,
      first_name,
      last_name,
      full_address,
      country,
      phone_number,
      email_address,
      profession,
      other_profession: profession === 'Other' ? other_profession : '',
      resumePath,
      passportPath,
      confirm_eligibility,
      terms_and_condition,
      createdAt: new Date(),
      status: 'new',
      updatedAt: new Date()
    };
    
    const newApplication = await j1ApplicationsCollection.insertOne(applicationData);

    if (!newApplication.acknowledged) {
      return NextResponse.json(
        { error: 'Database error while creating application' },
        { status: 500 }
      );
    }

    // Return success response with application details
    return NextResponse.json({ 
      success: true, 
      application: {
        _id: newApplication.insertedId,
        applicationId,
        first_name,
        last_name,
        email_address
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting J1 visa application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const j1ApplicationsCollection = db.collection('j1_applications');

    // Get all applications, sorted by creation date (newest first)
    const applications = await j1ApplicationsCollection.find({}, {
      projection: {
        resumePath: 0,
        passportPath: 0,
        // Exclude sensitive information from the list view
      }
    })
    .sort({ createdAt: -1 })
    .toArray();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching J1 visa applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}