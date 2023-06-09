import { ChangeEventHandler } from 'react';

import { selector, useRecoilState, useRecoilValue } from 'recoil';

import { textState } from '../common/store';

const TextInput = () => {
  const [text, setText] = useRecoilState(textState);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
};

const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});

const CharacterCount = () => {
  const count = useRecoilValue(charCountState);
  return <>Character Count: {count}</>;
};

export const CharacterCounter = () => (
  <div>
    <TextInput></TextInput>
    <CharacterCount />
  </div>
);
