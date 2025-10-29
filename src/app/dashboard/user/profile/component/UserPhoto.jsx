"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../border.module.css';
import { GrEdit } from "react-icons/gr";
import updateData from '../updateDataApi/updateData';
import Swal from 'sweetalert2';

const UserPhoto = ({ resultUser }) => {
    const [toggle, setToggle] = useState(true);
    const handleUpdate = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const image = e.target.image.value;
        const email = resultUser?.email;
        const payload = { name, image, email };
        const result = await updateData(payload);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "update successfully",
            showConfirmButton: false,
            timer: 1500
        });
        setToggle(true);
    }

    return (
        <div className='bg-base-300 px-3 py-5 rounded-2xl'>

            {
                toggle ? (<div>
                    {/* photo */}
                    <div className={`mx-auto ${styles.container}`}>
                        <div className={`bg-white ${styles.box}`}>
                            {
                                resultUser?.image ? <Image
                                    src={resultUser?.image}
                                    width={300}
                                    height={300}
                                    alt={resultUser?.name}
                                    unoptimized
                                    className='w-[300px] h-[300px] object-cover rounded-full'
                                /> : <Image
                                    src="/mel-user.png"
                                    width={300}
                                    height={300}
                                    alt={resultUser?.name}
                                    unoptimized
                                    className='w-[300px] h-[300px] object-cover rounded-full'
                                />
                            }
                        </div>
                    </div>

                    {/* edit */}
                    <div className='w-[300px] mx-auto flex justify-end'>
                        <GrEdit
                            onClick={() => setToggle(false)}
                            className='btn' size={30} />
                    </div>

                    {/* context */}
                    <div className='text-center mt-3'>
                        <h4 className='text-2xl font-bold'>{resultUser?.name}</h4>
                        <p className='bg-[#c9d3da] mt-5'>{resultUser?.email}</p>
                        <h5 className='mt-4'>USER Id : {resultUser?._id}</h5>
                    </div>
                </div>) : (<div className=''>
                    {/* form */}
                    <h3 className='text-2xl font-bold text-center'>update data</h3>
                    <div className='flex justify-center'>
                        <form onSubmit={handleUpdate}>
                            <fieldset className="fieldset md:w-[350px] px-4 ">
                                <label className="label">User name</label>
                                <input type="text"
                                    defaultValue={resultUser?.name}
                                    name='name'
                                    className="input" placeholder="name" />
                                <label className="label">photo url</label>
                                <input type="url"
                                    defaultValue={resultUser?.image}
                                    name='image'
                                    className="input" placeholder="photo url" />

                                <div className='flex justify-around mt-4'>
                                    <button
                                        onClick={() => setToggle(true)}
                                        type='button'
                                        className="btn btn-neutral rounded-xl">Cancel</button>
                                    <button
                                        type='submit'
                                        className="btn bg-green-500 text-white rounded-xl">Save</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>)
            }



        </div>
    );
};

export default UserPhoto;