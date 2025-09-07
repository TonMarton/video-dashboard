import { useState } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useCreateVideoMutation } from '../../store/api/videoApi';
import { CreateVideoRequest } from '@video-dashboard/shared-types';
import TopBar from '../../components/TopBar';
import BackButton from './components/BackButton';
import SuccessDialog from './components/SuccessDialog';

function CreateVideo() {
  const navigate = useNavigate();
  const [createVideo, { isLoading, error }] = useCreateVideoMutation();
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: '',
    thumbnail_url: '',
    duration: 300,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must be 255 characters or less';
    }

    if (formData.thumbnail_url.trim()) {
      try {
        new URL(formData.thumbnail_url);
      } catch {
        errors.thumbnail_url = 'Please enter a valid URL';
      }
    }

    if (formData.tags && formData.tags.some(tag => tag.length > 50)) {
      errors.tags = 'Each tag must be 50 characters or less';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        tags: formData.tags?.length ? formData.tags : undefined,
      };

      await createVideo(submitData).unwrap();
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Failed to create video:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      thumbnail_url: '',
      duration: 300,
      tags: [],
    });
    setTagInput('');
    setValidationErrors({});
  };

  const handleCreateMore = () => {
    resetForm();
    setShowSuccessDialog(false);
  };

  const handleDone = () => {
    navigate('/');
  };

  const handleInputChange = (field: keyof CreateVideoRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      if (trimmedTag.length > 50) {
        setValidationErrors(prev => ({
          ...prev,
          tags: 'Tag must be 50 characters or less',
        }));
        return;
      }
      handleInputChange('tags', [...(formData.tags || []), trimmedTag]);
      setTagInput('');
      setValidationErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      'tags',
      formData.tags?.filter(tag => tag !== tagToRemove) || []
    );
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <TopBar>
        <BackButton />
      </TopBar>
      
      <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Video
        </h1>
        <p className="text-gray-600">
          Fill in the details below to add a new video to your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Video Title" />
            <span className="text-red-500 ml-1">*</span>
          </div>
          <TextInput
            id="title"
            type="text"
            placeholder="Enter video title"
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            color={validationErrors.title ? 'failure' : 'gray'}
            helperText={validationErrors.title}
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="thumbnail_url" value="Thumbnail URL (optional)" />
          </div>
          <TextInput
            id="thumbnail_url"
            type="url"
            placeholder="https://example.com/thumbnail.jpg"
            value={formData.thumbnail_url}
            onChange={e => handleInputChange('thumbnail_url', e.target.value)}
            color={validationErrors.thumbnail_url ? 'failure' : 'gray'}
            helperText={validationErrors.thumbnail_url}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="tags" value="Tags (optional)" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <TextInput
                id="tags"
                type="text"
                placeholder="Enter a tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                color="light"
                size="sm"
              >
                Add Tag
              </Button>
            </div>

            {validationErrors.tags && (
              <p className="text-sm text-red-600">{validationErrors.tags}</p>
            )}

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="flex-1"
            color="blue"
          >
            {isLoading ? 'Creating...' : 'Create Video'}
          </Button>

          <Button
            type="button"
            color="light"
            onClick={resetForm}
          >
            Reset
          </Button>
        </div>
      </form>
      </div>

      <SuccessDialog
        isOpen={showSuccessDialog}
        onCreateMore={handleCreateMore}
        onDone={handleDone}
      />
    </>
  );
}

export default CreateVideo;
