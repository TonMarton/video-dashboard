import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGetVideosQuery } from '../../store/api/videoApi';
import VideoCard from '../../components/VideoCard';
import SearchBar from '../../components/SearchBar';
import { VideoWithTags, VideoSortField, SortOrder } from '@video-dashboard/shared-types';
import { Spinner } from 'flowbite-react';

function Videos() {
  const [allVideos, setAllVideos] = useState<VideoWithTags[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<VideoSortField>(VideoSortField.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo(() => ({
    cursor,
    limit: 12,
    sortBy,
    sortOrder,
    filters: debouncedSearchTerm.trim() ? `title:${debouncedSearchTerm.trim()}` : undefined,
  }), [cursor, sortBy, sortOrder, debouncedSearchTerm]);

  const { data, isLoading, isFetching, error } = useGetVideosQuery(queryParams);

  useEffect(() => {
    if (data) {
      if (cursor) {
        setAllVideos(prev => [...prev, ...data.items]);
      } else {
        setAllVideos(data.items);
      }
      setHasMore(data.has_more);
    }
  }, [data, cursor]);

  useEffect(() => {
    setCursor(undefined);
    setAllVideos([]);
    setHasMore(true);
  }, [debouncedSearchTerm, sortBy, sortOrder]);

  const loadMore = useCallback(() => {
    if (data?.next_cursor && hasMore && !isFetching) {
      setCursor(data.next_cursor);
    }
  }, [data?.next_cursor, hasMore, isFetching]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSortByChange = useCallback((newSortBy: VideoSortField) => {
    setSortBy(newSortBy);
  }, []);

  const handleSortOrderChange = useCallback((newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (isLoading && allVideos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading videos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Videos
        </h1>
        
        {allVideos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {debouncedSearchTerm ? 'No videos found matching your search.' : 'No videos available.'}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {isFetching && allVideos.length > 0 && (
          <div className="flex justify-center mt-8">
            <Spinner size="lg" />
          </div>
        )}

        {!hasMore && allVideos.length > 0 && (
          <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
            No more videos to load
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;
