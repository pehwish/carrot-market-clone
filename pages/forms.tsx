import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';

// Less code
// Better validation
// Better Erros (set clear, display)
// Have control over inputs
// Dont deal with events
// Easier Inputs

/**
 * 첫번째 모든 건 useForm Hook에서 나온다
 * 두번째 input들을 전부 state 에 '등록'하기 위해서 register 함수를 사용한다
 *
 * handleSubmit 인자로 2개 또는 1개의 함수를 받음
 * 1개는 필수로 설정하게 되어있음
 * 첫번째 함수는 너의 form 이 유효할 때만 실행되는 함수
 * 두번째 함수는 유효하기 않을때 실행되는 함수
 */

interface LoginForm {
  username: string;
  email: string;
  password: string;
}

export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: 'onBlur' });

  const onValid = (data: LoginForm) => {
    console.log("i'm valid bby");
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };
  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: {
            message: 'The username should be longer than 5 chars',
            value: 5,
          },
        })}
        type='text'
        placeholder='Username'
        required
      />

      <input
        {...register('email', {
          required: 'Email is required',

          validate: {
            notGmail: (value) =>
              !value.includes('@gmail.com') || 'Gmail is not allowed',
          },
        })}
        type='email'
        placeholder='Email'
      />
      {errors.email?.massage}
      <input
        {...register('password', { required: 'Password is required' })}
        type='password'
        placeholder='Password'
      />
      <input type='submit' value={'Create Account'} />
    </form>
  );
}
