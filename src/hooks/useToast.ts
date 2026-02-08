import { useState, useCallback } from 'react';

export function useToast() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }, []);

    const hideToast = useCallback(() => {
        setShow(false);
    }, []);

    return {
        show,
        message,
        showToast,
        hideToast,
    };
}
