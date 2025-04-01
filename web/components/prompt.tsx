import React, { Fragment } from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import { Dialog, Transition } from '@headlessui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface confirmType {
  show: boolean;
  proceed: any;
  dismiss: Function;
  cancel: Function;
  message: string;
  title?: string;
  schema?: yup.ObjectSchema<any>;
  inputType?: string;
}

const ComplexConfirmation = ({
  show,
  proceed,
  dismiss,
  cancel,
  message,
  title,
  schema,
  inputType = 'text',
}: confirmType) => {
  const validationItem = schema || yup.string().required('값을 입력해 주세요.');

  const _schema = yup.object({ value: validationItem });
  const methods = useForm<yup.InferType<typeof _schema>>({
    resolver: yupResolver(_schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: yup.InferType<typeof _schema>) => {
    proceed(data.value);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 font-system"
        onClose={() => cancel()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-system_medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <FormProvider {...methods}>
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor=""
                          className="block mb-3 font-system_medium text-gray-900"
                        >
                          {message}
                        </label>
                      </div>
                      {title == '나이' ? (
                        <select
                          {...register('value')}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                          <optgroup label="나이를 선택하세요">
                            <option value="under_60">60세 미만</option>
                            <option value="from_60_under_65">
                              60세 이상 65세 미만
                            </option>
                            <option value="from_65_under_70">
                              65세 이상 70세 미만
                            </option>
                            <option value="from_70">70세 이상</option>
                          </optgroup>
                        </select>
                      ) : (
                        <input
                          {...register('value')}
                          type={inputType}
                          className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-700 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                      )}

                      {errors.value && (
                        <p className="text-red-400">
                          {errors.value.message as string}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-blue-100 px-4 py-2 text-sm font-system_medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={(e) => {
                          e.preventDefault();
                          dismiss();
                        }}
                      >
                        닫기
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-blue-100 px-4 py-2 text-sm font-system_medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        제출
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default createConfirmation(confirmable(ComplexConfirmation));
