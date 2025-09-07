import { Button } from 'flowbite-react';

interface SuccessDialogProps {
  isOpen: boolean;
  onCreateMore: () => void;
  onDone: () => void;
}

function SuccessDialog({ isOpen, onCreateMore, onDone }: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 dark:bg-opacity-30">
      <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh] w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Video Created Successfully!
          </h3>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Your video has been created and added to your dashboard. What would you like to do next?
          </p>
        </div>
        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-3">
          <Button onClick={onCreateMore} color="blue" className="flex-1">
            Create More
          </Button>
          <Button onClick={onDone} color="gray" className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessDialog;
