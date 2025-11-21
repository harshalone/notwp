import { NextResponse } from 'next/server';
import { SESClient, GetAccountSendingEnabledCommand } from '@aws-sdk/client-ses';

export async function POST(request) {
  try {
    const body = await request.json();
    const { awsRegion, awsAccessKeyId, awsSecretAccessKey } = body;

    // Validate required fields
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
      return NextResponse.json(
        { success: false, error: 'AWS credentials are required' },
        { status: 400 }
      );
    }

    // Create SES client with provided credentials
    const sesClient = new SESClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    // Test the connection by checking account sending status
    const command = new GetAccountSendingEnabledCommand({});
    const response = await sesClient.send(command);

    if (response.Enabled === false) {
      return NextResponse.json({
        success: false,
        error: 'AWS SES account sending is disabled. Please enable it in your AWS console.'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful! AWS SES is configured correctly.'
    });
  } catch (error) {
    console.error('Error testing SES connection:', error);

    let errorMessage = 'Failed to connect to AWS SES';

    if (error.name === 'InvalidClientTokenId') {
      errorMessage = 'Invalid AWS Access Key ID';
    } else if (error.name === 'SignatureDoesNotMatch') {
      errorMessage = 'Invalid AWS Secret Access Key';
    } else if (error.name === 'UnrecognizedClientException') {
      errorMessage = 'Invalid AWS credentials';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
