/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@uploadthing/react" {
  import { FileRouter } from "uploadthing/next";

  export function generateComponents<T extends FileRouter>(): {
    UploadButton: React.ComponentType<any>;
    UploadDropzone: React.ComponentType<any>;
    Uploader: React.ComponentType<any>;
  };
}

declare module "@uploadthing/react/hooks" {
  import { FileRouter } from "uploadthing/next";

  export function generateReactHelpers<T extends FileRouter>(): {
    useUploadThing: (endpoint: keyof T) => {
      startUpload: (files: File[]) => Promise<
        {
          url: string;
          name: string;
          size: number;
        }[]
      >;
      isUploading: boolean;
    };
  };
}
