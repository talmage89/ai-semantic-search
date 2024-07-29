'use client';
import * as React from 'react';
import { FileTextIcon } from '@radix-ui/react-icons';
import { ErrorMessage, Message } from '../../types';
import './Chat.scss';

type ChatProps = {
  conversation: (Message | ErrorMessage)[];
};

export const Chat = (props: ChatProps) => {
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
    </div>
  );
};
