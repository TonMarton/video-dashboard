import { Card, Badge, Tooltip } from 'flowbite-react';
import { VideoWithTags } from '@video-dashboard/shared-types';
import ImageWithSkeleton from '../ImageWithSkeleton';

interface VideoCardProps {
  video: VideoWithTags;
}

function VideoCard({ video }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - videoDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  };

  return (
    <Card className="max-w-sm h-full flex flex-col">
      <div className="relative">
        <ImageWithSkeleton
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-48 rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Tooltip content={video.title} placement="top">
            <h5 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2 cursor-help">
              {video.title}
            </h5>
          </Tooltip>
          <div className="flex flex-wrap gap-2 mb-4">
            {video.tags.map((tagRelation) => (
              <Badge key={tagRelation.tag.id} color="blue" size="sm">
                {tagRelation.tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
          <span>{video.views} views</span>
          <span>{formatDate(video.created_at)}</span>
        </div>
      </div>
    </Card>
  );
}

export default VideoCard;
