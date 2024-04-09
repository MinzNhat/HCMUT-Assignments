import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { IoMdClose } from 'react-icons/io';

interface DropzoneProps {
    className?: string;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Dropzone: React.FC<DropzoneProps> = ({ className, files, setFiles }) => {
    const [rejected, setRejected] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
        let newFiles = [...files, ...acceptedFiles];

        if (newFiles.length > 2) {
            newFiles.shift();
        }

        setFiles(newFiles);

        if (rejectedFiles.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles]);
        }
    }, [files, setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        //@ts-ignore
        accept: 'image/*',
        maxSize: 1024 * 1000,
        maxFiles: 2,
        //@ts-ignore
        onDrop
    });

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    }, [files]);

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.name !== name));
    };

    const removeAll = () => {
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(file => file.name !== name));
    };

    return (
        <form className='w-full grow'>
            <div
                {...getRootProps({
                    className: className
                })}
            >
                <input {...getInputProps({ name: 'files' })} />
                <div className='flex flex-col items-center justify-center gap-4 w-full h-full outline-dashed rounded-xl'>
                    {isDragActive ? (
                        <p>Thả ảnh ở đây</p>
                    ) : (
                        <p>Nhấn vào đây để thêm ảnh hoặc kéo thả ảnh</p>
                    )}
                </div>
            </div>

            {files.length != 0 && <section className='mt-1 p-2 pb-6 rounded-lg'>
                <ul className='mt-6 grid grid-cols-2 gap-6 sm:grid-cols-2 min-h-[130px]'>
                    {files.map((file, index) => (
                        <li key={index} className='relative h-32 w-full rounded-md px-2 border border-gray-300'>
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                width={100}
                                height={100}
                                className='h-full w-full rounded-md object-contain'
                            />
                            <div className='mt-1 text-[12px] font-medium text-stone-500 text-center whitespace-nowrap truncate'>
                                {file.name}
                            </div>
                            <button
                                type='button'
                                className='absolute -right-3 -top-3 bg-red-500 pr-.5 flex h-7 w-7 place-items-center justify-center rounded-full hover:bg-gray-300 text-white'
                                onClick={() => removeFile(file.name)}
                            >
                                <IoMdClose className='h-5 w-5' />
                            </button>

                        </li>
                    ))}
                </ul>
            </section>}
            <div className='w-full h-4'></div>
        </form>
    );
};

export default Dropzone;
