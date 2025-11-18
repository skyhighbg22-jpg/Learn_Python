import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, User, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfilePictureUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
  userId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfilePictureUpload = ({
  currentAvatar,
  onAvatarChange,
  userId,
  className = '',
  size = 'md'
}: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onAvatarChange(null); // Clear avatar if invalid
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  // Upload image to Supabase Storage
  const uploadImage = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user's profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarChange(publicUrl);
      setShowModal(false);
      setPreviewUrl(null);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [userId, onAvatarChange]);

  // Start camera capture
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required to take a photo');
    }
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFileSelect(file);
        }
      }, 'image/jpeg', 0.8);
    }

    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }, [handleFileSelect]);

  // Use system image picker
  const selectSystemImage = useCallback(async () => {
    try {
      // Try file picker first (more flexible)
      if ('showOpenFilePicker' in window) {
        const fileHandle = await (window as any).showOpenFilePicker({
          types: [{
            description: 'Images',
            accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }
          }],
          multiple: false
        });
        const file = await fileHandle.getFile();
        handleFileSelect(file);
      } else {
        // Fallback to file input
        fileInputRef.current?.click();
      }
    } catch (error) {
      console.error('System image picker failed:', error);
      fileInputRef.current?.click();
    }
  }, [handleFileSelect]);

  const currentImage = currentAvatar || previewUrl;

  return (
    <>
      {/* Main Profile Picture Display */}
      <div className={`relative ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 group cursor-pointer transition-all duration-300 hover:border-blue-500`}>
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
              onClick={() => setShowModal(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-slate-600 hover:bg-slate-500 transition-colors"
              onClick={() => setShowModal(true)}
            >
              <User className="text-slate-400" size={size === 'sm' ? 24 : size === 'md' ? 32 : 48} />
            </div>
          )}

          {/* Upload indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="text-white animate-spin" size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
            </div>
          )}

          {/* Edit badge */}
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Change profile picture"
          >
            <Camera size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl w-full mx-4 max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Camera className="text-blue-400" size={24} />
                Profile Picture
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreviewUrl(null);
                  // Stop camera if running
                  if (videoRef.current?.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream?.getTracks().forEach(track => track.stop());
                  }
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="text-slate-400" size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Current Preview */}
              {previewUrl && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
                  <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-slate-600">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Uploading...</span>
                        <span className="text-blue-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Options */}
              {!isUploading && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Camera Option */}
                  <button
                    onClick={startCamera}
                    className="p-6 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200 transform hover:scale-105 hover:border-blue-500"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Camera className="text-blue-400" size={32} />
                      <span className="text-white font-medium">Take Photo</span>
                      <span className="text-slate-400 text-sm">Use camera</span>
                    </div>
                  </button>

                  {/* System Images Option */}
                  <button
                    onClick={selectSystemImage}
                    className="p-6 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200 transform hover:scale-105 hover:border-green-500"
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Upload className="text-green-400" size={32} />
                      <span className="text-white font-medium">Choose File</span>
                      <span className="text-slate-400 text-sm">Browse your device</span>
                    </div>
                  </button>

                  {/* Camera View (hidden initially) */}
                  <div className="col-span-1 hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-lg border border-slate-600"
                    />

                    {videoRef.current?.srcObject && (
                      <button
                        onClick={capturePhoto}
                        className="mt-4 w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Capture Photo
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};