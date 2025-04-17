declare const documentPictureInPicture:
  | {
      window: Window | null;
      requestWindow: (options?: {
        width?: number;
        height?: number;
      }) => Promise<Window>;
    }
  | undefined;
