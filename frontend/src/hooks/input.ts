import { ChangeEvent, useState } from "react";

interface UseTextInputState<State> {
   state: State;
   resetInputs: () => void;
}

type CustomHandlers<T> = Record<
   `change${Capitalize<string & keyof T>}`,
   (e: ChangeEvent<HTMLInputElement>) => void
>;

type UseTextInput<T> = UseTextInputState<T> & CustomHandlers<T>;

const useTextInput = <T extends Record<string, string>>(
   initialState: T,
): UseTextInput<T> => {
   const [state, setState] = useState<T>(initialState);

   const customFunc = {} as CustomHandlers<T>;

   const resetInputs = () => {
      setState(() => initialState);
   };

   Object.keys(state).forEach((property) => {
      customFunc[
         `change${
            (property.charAt(0).toUpperCase() +
               property.slice(1)) as Capitalize<string & keyof T>
         }`
      ] = (e: ChangeEvent<HTMLInputElement>) => {
         setState((prev) => ({ ...prev, [property]: e.target.value }));
      };
   });

   const [customFuncsState] = useState<CustomHandlers<T>>(customFunc);

   return { state, resetInputs, ...customFuncsState };
};

export { useTextInput };
