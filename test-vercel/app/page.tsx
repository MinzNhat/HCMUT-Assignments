import { FC } from 'react';
import { FcGoogle } from "react-icons/fc";
import InputField from '@/components/fields/InputField';
import Checkbox from '@/components/checkbox/index2';
import AuthLayout from './layout';
import Link from 'next/link';
import FixedPlugin from '@/components/fixedPlugin/FixedPlugin';

type Props = {};

const AuthPage: FC<Props> = () => {
    return (
        <div>
            <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
                <main className={`mx-auto min-h-screen`}>
                    <div className="relative flex h-screen">
                        <div className="mx-auto flex min-h-full h-full w-full flex-col justify-start">
                            <div className="flex lg:w-[51vw] 2xl:w-[45vw] items-center justify-center lg:items-center lg:justify-start h-full px-4 sm:px-8 md:px-16 lg:px-28">
                                {/* Sign in section */}
                                <div className="w-full flex-col items-center md:pl-4 lg:pl-0">
                                    <div className='flex justify-between'>
                                        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                                            Đăng nhập
                                        </h4>
                                        <FixedPlugin />
                                    </div>

                                    <p className="mb-9 ml-1 text-base text-gray-600">
                                        Nhập email và mật khẩu để đăng nhập!
                                    </p>
                                    <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
                                        <div className="rounded-full text-xl">
                                            <FcGoogle />
                                        </div>
                                        <h5 className="text-sm font-medium text-navy-700 dark:text-white">
                                            Đăng nhập bằng Google
                                        </h5>
                                    </div>
                                    <div className="mb-6 flex items-center  gap-3">
                                        <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
                                        <p className="text-base text-gray-600 dark:text-white"> hoặc </p>
                                        <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
                                    </div>

                                    {/* Email */}
                                    <InputField variant="auth" extra="mb-3" label="Email*" placeholder="email@hcmut.edu.vn" id="email" type="text" />

                                    {/* Password */}
                                    <InputField variant="auth" extra="mb-3" label="Mật khẩu*" placeholder="Tối thiểu 8 ký tự" id="password" type="password" />

                                    {/* Checkbox */}
                                    <div className="mb-4 flex items-center justify-between px-2">
                                        <div className="flex items-center">
                                            <Checkbox id='remember-me' />
                                            <label htmlFor='remember-me' className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                                                Lưu đăng nhập
                                            </label>
                                        </div>
                                        <a className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white" href="">
                                            Quên mật khẩu?
                                        </a>
                                    </div>

                                    <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                        Đăng nhập
                                    </button>

                                    <div className="mt-4">
                                        <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
                                            Chưa đăng ký?
                                        </span>
                                        <a href=" " className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
                                            Tạo tài khoản
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0 hidden h-screen lg:block lg:w-[49vw] 2xl:w-[55vw]">
                                <div
                                    className={`flex h-full w-full items-end justify-center bg-cover bg-left lg:rounded-bl-[120px] xl:rounded-bl-[200px] bg-[url('/img/auth/auth.png')]`}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AuthPage;