'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import Heading from '../Heading';
import Input from "../inputs/Input";
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
enum STEPS {
  SEARCH = 0,

}

export default function SearchModal() {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      search: ''
    },
  });
  const [step, setStep] = useState(STEPS.SEARCH);


  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    const url = `/arama?name=${data.search}`;
    searchModal.onClose();
    router.push(url);


  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.SEARCH) {
      return 'Ara'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.SEARCH) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Tarif Ara"
        subtitle="Aklınıza gelecek tarifleri bulun"
      />
      <hr />
      <Input
        id={`search`}
        label="Tarif Ara..."
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Arama"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.SEARCH ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}
