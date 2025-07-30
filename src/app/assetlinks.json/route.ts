import { NextResponse } from 'next/server';

// This file serves the assetlinks.json file to verify the app for TWA.
// You will need to replace the values with your actual app's details.
// Learn more at https://developer.chrome.com/docs/android/trusted-web-activity/digital-asset-links
export async function GET() {
  return NextResponse.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        // TODO: Replace with your package name
        package_name: 'com.example.app', 
        // TODO: Replace with your app's SHA-256 certificate fingerprint
        sha256_cert_fingerprints: [
          '00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF',
        ],
      },
    },
  ]);
}
