import * as React from 'react';
import './QuestionInput.scss';
import { IconButton } from '~/ui';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

type QuestionInputProps = {
  onSubmit: (question: string) => void;
};

export const QuestionInput = (props: QuestionInputProps) => {
  const [question, setQuestion] = React.useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.onSubmit(question);
    setQuestion('');
  }

  return (
    <form className="QuestionInput" onSubmit={handleSubmit}>
      <span className="flex align-center gap-2">
        <input
          type="text"
          placeholder="Ask a question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <IconButton type="submit" icon={<PaperPlaneIcon />} color="inverse" />
      </span>
    </form>
  );
};
