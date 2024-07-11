'use client';
import * as React from 'react';
import { FileTextIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { IconButton } from '~/ui';
import { ErrorMessage, Message } from '../..';
import './Chat.scss';

type ChatProps = {
  onSubmit: (message: string) => void;
  conversation: (Message | ErrorMessage)[];
};

export const Chat = (props: ChatProps) => {
  const [question, setQuestion] = React.useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.onSubmit(question);
    setQuestion('');
  }

  function isErrorMessage(msg: Message | ErrorMessage): msg is ErrorMessage {
    return (msg as ErrorMessage).error !== undefined;
  }

  return (
    <div className="Chat">
      <div className="Chat__messages">
        {props.conversation.map((msg, i) => (
          <div className="Chat__message__container" key={i}>
            {isErrorMessage(msg) ? (
              <>
                <div className="Chat__message__avatar">
                  <FileTextIcon />
                </div>
                <div key={i} className="Chat__message Chat__message--error Chat__message--incoming">
                  {msg.error.message}
                </div>
              </>
            ) : (
              <>
                {msg.direction === 'incoming' && (
                  <div className="Chat__message__avatar">
                    <FileTextIcon />
                  </div>
                )}
                <div key={i} className={`Chat__message Chat__message--${msg.direction}`}>
                  {msg.text}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <form className="Chat__input" onSubmit={handleSubmit}>
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
    </div>
  );
};
