import { useState } from 'react';
import { TextInput, Button, Select, Modal, Label } from 'flowbite-react';
import { HiSearch, HiFilter, HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { VideoSortField, SortOrder } from '@video-dashboard/shared-types';
import TopBar from '../TopBar';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: VideoSortField;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: VideoSortField) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

function SearchBar({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SearchBarProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const sortOptions = [
    { value: VideoSortField.CREATED_AT, label: 'Created Date' },
    { value: VideoSortField.TITLE, label: 'Title' },
    { value: VideoSortField.VIEWS, label: 'Views' },
    { value: VideoSortField.DURATION, label: 'Duration' },
  ];

  const orderOptions = [
    { value: SortOrder.DESC, label: 'Descending' },
    { value: SortOrder.ASC, label: 'Ascending' },
  ];

  return (
    <>
      <TopBar>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/create-video')}
            color="blue"
            size="sm"
            className="whitespace-nowrap flex-shrink-0"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <HiPlus className="w-4 h-4" />
              <span className="sm:hidden">Create</span>
              <span className="hidden sm:inline">Create Video</span>
            </div>
          </Button>
          
          <div className="flex-1">
            <TextInput
              id="search"
              type="text"
              icon={HiSearch}
              placeholder="Search videos by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full [&>input]:pl-10"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy" value="Sort by:" className="whitespace-nowrap" />
              <Select
                id="sortBy"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as VideoSortField)}
                className="min-w-[140px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sortOrder" value="Order:" className="whitespace-nowrap" />
              <Select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
                className="min-w-[120px]"
              >
                {orderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="md:hidden flex-shrink-0">
            <Button
              color="gray"
              size="sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <HiFilter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </TopBar>

      <Modal
        show={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        size="md"
        position="center"
        className="backdrop-blur-sm"
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner: "relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]"
          },
          root: {
            base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            show: {
              on: "flex bg-gray-900 bg-opacity-30 dark:bg-opacity-30",
              off: "hidden"
            }
          }
        }}
      >
        <Modal.Header>Filter & Sort Options</Modal.Header>
        <Modal.Body className="space-y-6">
          <div>
            <Label htmlFor="mobileSortBy" value="Sort by" className="mb-2 block" />
            <Select
              id="mobileSortBy"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as VideoSortField)}
              className="w-full"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="mobileSortOrder" value="Sort order" className="mb-2 block" />
            <Select
              id="mobileSortOrder"
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
              className="w-full"
            >
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsFilterModalOpen(false)} className="w-full">
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SearchBar;
