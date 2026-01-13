import { MutableRefObject } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import type { CameraPermissionState } from '@capacitor/camera';

type EnsureCameraOptions = {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
  autoplay?: boolean;
};

const cameraStateIsGranted = (state?: CameraPermissionState) =>
  state === 'granted' || state === 'limited';

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 16);
    }
  });

const resolveVideoElement = async (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  attempts = 60
) => {
  let attempt = 0;

  while (!videoRef.current && attempt < attempts) {
    await waitForNextFrame();
    attempt += 1;
  }

  const video = videoRef.current;
  if (!video) {
    throw new Error('Camera element not ready.');
  }

  return video;
};

const hasBrowserMediaDevices = () => {
  if (typeof navigator === 'undefined') return false;

  const anyNavigator = navigator as Navigator & {
    webkitGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
    mozGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
    msGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
  };

  return Boolean(
    navigator.mediaDevices?.getUserMedia ||
      anyNavigator.webkitGetUserMedia ||
      anyNavigator.mozGetUserMedia ||
      anyNavigator.msGetUserMedia
  );
};

const isSecureContext = () => {
  if (typeof window === 'undefined') return false;
  // Native apps are considered secure; browsers require https or localhost
  try {
    // @ts-ignore - optional
    const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
    if (isCapacitor) return true;
  } catch {}

  if (window.isSecureContext) return true;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
};

const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
  if (typeof navigator === 'undefined') {
    throw new Error('Camera is not available in this environment.');
  }

  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  const anyNavigator = navigator as Navigator & {
    webkitGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
    mozGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
    msGetUserMedia?: typeof navigator.mediaDevices.getUserMedia;
  };

  const legacyGetUserMedia =
    anyNavigator.webkitGetUserMedia ||
    anyNavigator.mozGetUserMedia ||
    anyNavigator.msGetUserMedia;

  if (!legacyGetUserMedia) {
    throw new Error('Camera API not supported on this browser.');
  }

  return new Promise<MediaStream>((resolve, reject) => {
    legacyGetUserMedia.call(anyNavigator, constraints, resolve, reject);
  });
};

const waitForMetadata = (video: HTMLVideoElement) =>
  new Promise<void>((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }

    const onLoaded = () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('loadeddata', onLoaded);
      resolve();
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('loadeddata', onLoaded);
  });

export const requestCameraPermission = async (): Promise<boolean> => {
  if (!hasBrowserMediaDevices()) {
    throw new Error('Camera API not supported on this device.');
  }

  try {
    if (!isSecureContext()) {
      throw new Error('Camera access requires HTTPS. Open the app over https or use localhost.');
    }

    if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Camera')) {
      const status = await Camera.checkPermissions();
      if (!cameraStateIsGranted(status.camera)) {
        const updated = await Camera.requestPermissions({ permissions: ['camera'] });
        if (!cameraStateIsGranted(updated.camera)) {
          throw new Error('Camera permission denied. Please allow camera access in app settings.');
        }
      }
      return true;
    } else {
      // Browser: actively request access to trigger permission prompt
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        // Immediately stop tracks; this is just for permission
        testStream.getTracks().forEach(t => t.stop());
        return true;
      } catch (err: any) {
        const name = err?.name as string | undefined;
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          throw new Error('Camera permission denied. Allow camera access in your browser.');
        }
        if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          throw new Error('No camera device found. Connect a camera and try again.');
        }
        if (name === 'NotReadableError') {
          throw new Error('Camera is in use by another app. Close it and retry.');
        }
        throw new Error('Unable to access the camera. Please check permissions.');
      }
    }
  } catch (err) {
    console.warn('Camera permission check failed.', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unable to verify camera permission.');
  }

  return true;
};

export const ensureCamera = async (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  streamRef: MutableRefObject<MediaStream | null>,
  options: EnsureCameraOptions = {}
): Promise<MediaStream> => {
  if (typeof window === 'undefined') {
    throw new Error('Camera not available on server-side rendering.');
  }

  const videoEl = await resolveVideoElement(videoRef);

  // Clean up existing stream first
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: options.facingMode ?? 'environment' },
      width: { ideal: options.width ?? window.innerWidth },
      height: { ideal: options.height ?? window.innerHeight }
    },
    audio: false
  };

  const shouldAutoplay = options.autoplay !== false;

  let stream: MediaStream;
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      stream = await getUserMedia(constraints);
      break;
    } catch (err) {
      retryCount++;
      if (retryCount >= maxRetries) {
        throw new Error(`Camera initialization failed after ${maxRetries} attempts: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 500 * retryCount));
    }
  }

  streamRef.current = stream;

  // Set up video element
  videoEl.srcObject = stream;
  videoEl.setAttribute('playsinline', 'true');
  videoEl.muted = true;

  // Wait for metadata to load
  await waitForMetadata(videoEl);

  // Ensure video is playing
  if (shouldAutoplay) {
    try {
      await videoEl.play();

      // Add event listeners to keep video playing
      const handlePause = async () => {
        if (videoEl.srcObject && shouldAutoplay) {
          try {
            await videoEl.play();
          } catch (err) {
            console.warn('Failed to resume video playback:', err);
          }
        }
      };

      const handleError = () => {
        console.error('Video element error occurred');
      };

      videoEl.addEventListener('pause', handlePause);
      videoEl.addEventListener('error', handleError);

      // Store cleanup function
      (videoEl as any)._cameraCleanup = () => {
        videoEl.removeEventListener('pause', handlePause);
        videoEl.removeEventListener('error', handleError);
      };
    } catch (err) {
      console.warn('Autoplay was blocked, attempting manual play call.', err);
      try {
        await videoEl.play();
      } catch (playError) {
        console.error('Failed to start video playback:', playError);
        throw new Error('Unable to start camera playback');
      }
    }
  }

  return stream;
};

export const stopCamera = (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  streamRef: MutableRefObject<MediaStream | null>
) => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  const videoEl = videoRef.current;
  if (videoEl) {
    // Clean up event listeners
    if ((videoEl as any)._cameraCleanup) {
      (videoEl as any)._cameraCleanup();
      delete (videoEl as any)._cameraCleanup;
    }

    videoEl.pause();
    videoEl.srcObject = null;
  }
};

