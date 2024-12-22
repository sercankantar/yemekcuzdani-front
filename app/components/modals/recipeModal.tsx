'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";

import useRentModal from '@/app/hooks/useRentModal';

import Modal from "./Modal";
import CategoryInput from '../inputs/CategoryInput';
import  Category  from '../navbar/Categories';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import Heading from '../Heading';

enum STEPS {
  CATEGORY = 0,
  INFO = 1,
  IMAGES = 2,
  DESCRIPTION = 3,
  INSTRUCTIONS = 4,
  DETAILS = 5
}
interface Category {
  Category_Name: string;
  icon: string;
  seo_url: string;
}
const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.yemekcuzdani.com/api/v1/recipes/category-list');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);
  
  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      description: '',
      name: '',
      categoryName: '',
      ingredients: [
        { Ingredient_Name: "", Ingredient_Type: "", Ingredient_Weight: "", Ingredient_Description: "" }
      ],
      recipe_instructions: [""],
      servings: 0,
      preparationTime: 0,
      cookingTime: 0,
      images: [],
    }
  });
   // Yeni eklenen watch ifadeleri
  const name = watch('name');
  const category_name = watch('category_name');
  const description = watch('description');
  const ingredients = watch('ingredients');
  const recipe_instructions = watch('recipe_instructions');
  const servings = watch('servings');
  const preparation_time = watch('preparation_time');
  const cooking_time = watch('cookingTime');
  const images = watch('images');
  const addIngredient = () => {
    const newIngredients = [
      ...ingredients, 
      { 
        Ingredient_Name: "", 
        Ingredient_Type: "", 
        Ingredient_Weight: "",  
        Ingredient_Description: "" 
      }
    ];
    setValue('ingredients', newIngredients, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };
  const removeIngredient = (index: number) => {
    const currentIngredients = ingredients; // Mevcut değerleri alın
    const newIngredients = currentIngredients.filter((_: any, i: number) => i !== index);
    setValue('ingredients', newIngredients, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.DETAILS) {
      return onNext();
    }
    setIsLoading(true);
    data.servings = parseInt(data.servings);
    data.preparation_time = parseInt(data.preparation_time);
    data.cooking_time = parseInt(data.cooking_time);
    for(let i = 0; i < data.ingredients.length; i++) {
      data.ingredients[i].Ingredient_Weight = parseInt(data.ingredients[i].Ingredient_Weight);
    }
    console.log(data);
    axios.post('https://api.yemekcuzdani.com/api/v1/recipes/create-recipe', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      toast.success('Tarifiniz oluşturuldu!');
      router.refresh();
      reset();
      setStep(STEPS.CATEGORY)
      rentModal.onClose();
    })
    .catch(() => {
      toast.error('Something went wrong.');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.DETAILS) {
      return 'Oluştur'
    }

    return 'İleri'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Geri'
  }, [step]);

  const addInstruction = () => {
    const newInstructions = [...recipe_instructions, ""];
    setValue('recipe_instructions', newInstructions, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const removeInstruction = (index: number) => {
    const currentInstructions = recipe_instructions;
    const newInstructions = currentInstructions.filter((_: any, i: number) => i !== index);
    setValue('recipe_instructions', newInstructions, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Hangi kategoriye ait bir tarifiniz var?"
        subtitle="Kategori seçiniz"
      />
      <div 
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div key={item.Category_Name} className="col-span-1">
            <CategoryInput
              onClick={(category) => 
                setCustomValue('category_name', category)}
              selected={category_name === item.Category_Name}
              label={item.Category_Name}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (step === STEPS.INFO) {
    bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
        title="Tarifinizin malzemeleri"
        subtitle="Tarifinizi detaylandırın!"
      />
       {ingredients.map((ingredient: any, index: any) => (
         <div key={index} className="flex gap-2 items-center">
           <Input
             id={`ingredients[${index}].Ingredient_Name`}
             label="Malzeme Adı"
             disabled={isLoading}
             register={register}
             errors={errors}
             required
           />
           <select
             id={`ingredients[${index}].Ingredient_Type`}
             {...register(`ingredients[${index}].Ingredient_Type`, { required: true })}
             disabled={isLoading}
             className="border rounded p-2"
           >
             <option value="" disabled selected>Seçiniz</option>
             <option value="g">g</option>
             <option value="ml">ml</option>
           </select>
           <Input
             id={`ingredients[${index}].Ingredient_Weight`}
             label="Malzeme Ağırlığı"
             disabled={isLoading}
             register={register}
             errors={errors}
           />
           <Input
             id={`ingredients[${index}].Ingredient_Description`}
             label="Açıklama"
             disabled={isLoading}
             register={register}
             errors={errors}
           />
           <button
             type="button"
             onClick={() => removeIngredient(index)}
             className="p-2 bg-red-500 text-white rounded"
           >
             Kaldır
           </button>
         </div>
       ))}
       <button
         type="button"
         onClick={addIngredient}
         className="mt-2 p-2 bg-blue-500 text-white rounded"
       >
         Yeni Malzeme Ekle
       </button>
     </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tarifinizin resmi"
          subtitle="Tarifinizi görselleştirin!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('images', value)}
          value={images}
        />
      </div>
    )
  }

  if(step === STEPS.INSTRUCTIONS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tarifinizin adım adım yapılışı"
          subtitle="Tarifinizi detaylandırın!"
        />
        {recipe_instructions.map((instruction: string, index: number) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              id={`recipe_instructions[${index}]`}
              label={`Adım ${index + 1}`}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="p-2 bg-red-500 text-white rounded"
            >
              Kaldır
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Yeni Adım Ekle
        </button>
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tarifinizi nasıl tanımlarsınız?"
          subtitle="Kısa ve tatlı en iyi!"
        />
        <Input
          id="name"
          label="Tarif Adı"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Tarif Açıklaması"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.DETAILS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tarifinizin detayları"
          subtitle="Tarifinizi detaylandırın!"
        />
        <Input
          id="servings"
          label="Kişi Sayısı"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="preparation_time"
          label="Hazırlık Süresi (dakika)"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="cooking_time"
          label="Pişirme Süresi (dakika)"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Tarifinizi paylaşın!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
}

export default RentModal;