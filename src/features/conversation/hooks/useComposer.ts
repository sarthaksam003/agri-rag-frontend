import { useComposerStore } from "../store/composer.store";

export const useComposer = () => {

    const text = useComposerStore((state) => state.text);

    const setText = useComposerStore((state) => state.setText);

    const clear = useComposerStore((state) => state.clear);


    return {

        text,

        setText,

        clear,


    };

};