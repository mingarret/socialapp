'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Modal({ children }) {
    const router = useRouter();
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    function closeModal(e) {
        if (e.target === dialogRef.current) {
            e.stopPropagation();
            onDismiss();
        }
    }

    return(
        <>
            <dialog className="backdrop:bg-gray-900 backdrop:opacity-50 rounded shadow-md" ref={dialogRef} onClose={onDismiss} onClick={closeModal}>
                <span onClick={onDismiss} className='absolute top-1 right-2 p-1 hover:bg-gray-300 cursor-pointer'>x</span>
                <div className="min-h-[200px] bg-[#0a0a0a] text-white p-8" >
                    {children}
                </div>
            </dialog>
        </>
   )
}