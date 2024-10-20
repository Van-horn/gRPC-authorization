import { FormEvent } from 'react';

const formPreventDefault = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
};

export default formPreventDefault;