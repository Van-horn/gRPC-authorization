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

   const resetInputs = () => {
      setState(() => initialState);
   };

   const customFuncs = Object.keys(state).reduce<CustomHandlers<T>>(
      (acc, property) => {
         acc[
            `change${
               (property.charAt(0).toUpperCase() +
                  property.slice(1)) as Capitalize<string & keyof T>
            }`
         ] = (e: ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, [property]: e.target.value }));
         };

         return acc;
      },
      {} as CustomHandlers<T>,
   );

   const [customFuncsState] = useState<CustomHandlers<T>>(customFuncs);

   return { state, resetInputs, ...customFuncsState };
};

export default useTextInput 