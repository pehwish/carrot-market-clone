import type { NextPage } from 'next';
import Button from '@components/button';
import Input from '@components/input';
import Layout from '@components/layout';
import useUser from '@libs/client/useUser';
import { FieldErrors, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useMutation from '@libs/client/useMutation';

interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  useEffect(() => {
    if (user?.email) setValue('email', user.email);
    if (user?.phone) setValue('phone', user.phone);
    if (user?.name) setValue('name', user.name);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/f59nsiCmngpWG3UeH6L7VA/${user.avatar}/avatar`
      );
  }, [user, setValue]);

  const onValid = async ({ email, phone, name }: EditProfileForm) => {
    if (loading) return;
    if (email === '' && phone === '' && name === '') {
      return setError('formErrors', {
        message:
          'Email of phone number are required. you need to choose one!!!',
      });
    }

    if (avatar && avatar.length && user?.id) {
      // ask for CF URL
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append('file', avatar[0], user?.id + '');
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: 'POST',
          body: form,
        })
      ).json();

      console.log(id);
      // upload file to CF URL
      editProfile({ email, phone, name, avatarId: id });
    } else {
      editProfile({ email, phone, name });
    }
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      return setError('formErrors', {
        message: data.error,
      });
    }
  }, [data, setError]);

  const avatar = watch('avatar');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (avatar && avatar.length) {
      console.log(avatar);
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout canGoBack title='Edit Profile'>
      <form className='py-10 px-4 space-y-4' onSubmit={handleSubmit(onValid)}>
        <div className='flex items-center space-x-3'>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className='w-14 h-14 rounded-full bg-slate-500'
            />
          ) : (
            <div className='w-14 h-14 rounded-full bg-slate-500' />
          )}

          <label
            htmlFor='picture'
            className='cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700'
          >
            Change
            <input
              {...register('avatar')}
              id='picture'
              type='file'
              className='hidden'
              accept='image/*'
            />
          </label>
        </div>
        <Input
          register={register('name')}
          label='Name'
          name='name'
          type='text'
        />
        <Input
          register={register('email')}
          label='Email address'
          name='email'
          type='email'
          required={false}
        />
        <Input
          register={register('phone')}
          required={false}
          label='Phone number'
          name='phone'
          type='number'
          kind='phone'
        />
        {errors.formErrors ? (
          <span className='my-2 text-red-500 font-medium block text-center'>
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button loading={loading} text='Update profile' />
      </form>
    </Layout>
  );
};

export default EditProfile;
