import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    // Return the format expected by the FileUpload component
    return Response.json({
      token: authenticationParameters.token,
      expire: authenticationParameters.expire,
      signature: authenticationParameters.signature,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return Response.json(
      {
        error: "Authentication for Imagekit failed",
      },
      { status: 500 }
    );
  }
}

/*This file is a **secure backend endpoint that generates temporary upload permission for your app’s users to upload files 
directly to ImageKit**. It uses your **private key on the server** to create a short-lived **authentication signature**,
 then sends that signature and your **public key** to the frontend. With this, your users can upload images 
 **without ever seeing your private key**, and ImageKit can still verify that the upload is authorized by **your project**. 
 */