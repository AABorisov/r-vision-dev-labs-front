import React, { createContext, useState } from 'react';

interface Props {
    isShow: boolean;
    toggle: () => void;
}

export const PopupUploadContext = createContext<Partial<Props>>({});

export const PopupFileUploadProvider = ({ children }: any) => {
    const [isShow, setIsShow] = useState<boolean>(false);

    const toggle = () => {
        setIsShow(!isShow);
    };

    const value = {
        isShow,
        toggle,
    } as Partial<Props>;

    return <PopupUploadContext.Provider value={value}>{children}</PopupUploadContext.Provider>;
};
