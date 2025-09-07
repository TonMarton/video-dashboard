import { Button } from 'flowbite-react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  text?: string;
}

function BackButton({ to = '/videos', text = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(to)}
      color="gray"
      size="sm"
      className="whitespace-nowrap flex-shrink-0"
    >
      <div className="flex items-center gap-2">
        <HiArrowLeft className="w-4 h-4" />
        <span>{text}</span>
      </div>
    </Button>
  );
}

export default BackButton;
