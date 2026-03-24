import React, { useState, useRef } from 'react';
import { Camera, Image, Upload, X, Trash2, Calendar, MessageCircle, ChevronLeft } from 'lucide-react';

export default function PhotoDiary({ userData, onUpdateUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ image: null, caption: '', date: new Date().toISOString() });
  const [viewPhoto, setViewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const photoDiary = userData.photoDiary || [];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhoto = () => {
    if (newPhoto.image) {
      onUpdateUser({
        photoDiary: [
          ...photoDiary,
          {
            id: Date.now(),
            ...newPhoto,
            date: new Date().toISOString()
          }
        ]
      });
      setNewPhoto({ image: null, caption: '', date: new Date().toISOString() });
      setShowAdd(false);
    }
  };

  const deletePhoto = (id) => {
    if (confirm('Delete this photo?')) {
      onUpdateUser({
        photoDiary: photoDiary.filter(p => p.id !== id)
      });
      setViewPhoto(null);
    }
  };

  if (viewPhoto) {
    const photo = photoDiary.find(p => p.id === viewPhoto);
    if (!photo) return null;

    return (
      <div className="p-6 pb-24">
        <button
          onClick={() => setViewPhoto(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Gallery
        </button>

        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-gray-800">
            <img
              src={photo.image}
              alt={photo.caption || 'Recovery photo'}
              className="w-full h-auto"
            />
          </div>

          {photo.caption && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{photo.caption}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(photo.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
          </div>

          <button
            onClick={() => deletePhoto(photo.id)}
            className="w-full border border-red-700/60 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Photo
          </button>
        </div>
      </div>
    );
  }

  if (showAdd) {
    return (
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Photo</h2>
          <button
            onClick={() => {
              setShowAdd(false);
              setNewPhoto({ image: null, caption: '', date: new Date().toISOString() });
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {!newPhoto.image ? (
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-900 border-2 border-dashed border-gray-700 hover:border-emerald-500/50 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Upload a Photo</p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 5MB</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                <img
                  src={newPhoto.image}
                  alt="Preview"
                  className="w-full h-auto"
                />
                <button
                  onClick={() => setNewPhoto(prev => ({ ...prev, image: null }))}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-900/80 backdrop-blur flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">Caption (optional)</label>
                <textarea
                  value={newPhoto.caption}
                  onChange={e => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="What does this photo represent in your journey?"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={addPhoto}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Image className="w-4 h-4" />
                Save to Diary
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Photo Diary</h1>
        <p className="text-gray-400 text-sm">Capture your recovery journey visually</p>
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-6"
      >
        <Camera className="w-4 h-4" />
        Add Photo
      </button>

      {photoDiary.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Photos Yet</h3>
          <p className="text-gray-400 text-sm">
            Start documenting your recovery journey with photos. Capture moments of progress, celebration, or reflection.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-xs">{photoDiary.length} {photoDiary.length === 1 ? 'photo' : 'photos'}</p>
          <div className="grid grid-cols-2 gap-3">
            {photoDiary
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(photo => (
                <button
                  key={photo.id}
                  onClick={() => setViewPhoto(photo.id)}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-800 hover:border-emerald-500/50 transition-all group"
                >
                  <img
                    src={photo.image}
                    alt={photo.caption || 'Recovery photo'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-900/80 backdrop-blur">
                      <p className="text-white text-xs line-clamp-2">{photo.caption}</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900/80 backdrop-blur flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-xs text-center">
          Photos are stored securely on your device and synced to your cloud account. They are never shared without your permission.
        </p>
      </div>
    </div>
  );
}
