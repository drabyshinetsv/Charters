/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { type FieldValues, type UseFormProps, useForm } from "react-hook-form";

type UseFormActionProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> = UseFormProps<TFieldValues, TContext> & {
  successMessage?: string;
  extraParams?: Record<string, string | Blob>;
  onAction(data: FormData): void;
  onSuccess?(): void;
};

/**
 * Hook for managing form actions and validations.
 * @template TFieldValues - Type for field values.
 * @template TContext - Type for additional context.
 * @param {UseFormActionProps<TFieldValues, TContext>} props - Props for useFormAction hook.
 * @returns {{
 *   ...UseFormProps<TFieldValues, TContext>,
 *   handleAction: (onAction: (payload: FormData) => void) => (payload: FormData) => Promise<void>
 * }} An object containing form methods and a handleAction function.
 * @example
 * const form = useFormAction<z.infer<typeof formSchema>>({
 *   defaultValues: initialFormValues,
 *   resolver: zodResolver(formSchema),
 *   onAction: serverHandler,
 * });
 *
 * <form action={form.handleAction}></form>
 */
const useFormAction = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(
  props: UseFormActionProps<TFieldValues, TContext>,
) => {
  const { onAction, onSuccess } = props;
  // const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Returns the form object with provided props.
   * @type {UseFormProps<TFieldValues, TContext>}
   */
  const form = useForm(props);

  /**
   * Handles form action, triggers form validation, and executes the provided action if form is valid.
   * @param {Function} onAction - Function to execute on form action.
   * @returns {Promise<void>} A promise resolving after action execution.
   */
  const handleAction = useCallback(
    async (payload: FormData) => {
      /**
       * Trigger form validation.
       * @type {boolean}
       */
      const isValid = await form.trigger();

      if (isValid) {
        try {
          // setIsSubmitting(true);

          if (props.extraParams) {
            for (const [key, value] of Object.entries(props.extraParams)) {
              payload.append(key, value);
            }
          }

          await onAction(payload);

          onSuccess?.();
        } catch (e) {
          console.log("Error:", e);
        } finally {
          // setIsSubmitting(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.trigger, onAction, props.values],
  );

  // return useMemo(
  //   () => {
  //     console.log("form.formState.errors", form.formState.errors);

  //     return {
  //       ...form,
  //       formState: {
  //         ...form.formState,
  //         isSubmitting,
  //       },
  //       handleAction,
  //     };
  //   },
  //   // [JSON.stringify(form), handleAction, isSubmitting, props.values],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [
  //     JSON.stringify(form.formState),
  //     handleAction,
  //     isSubmitting,
  //     props.values,
  //   ],
  // );

  return {
    ...form,
    // formState: {
    //   ...form.formState,
    //   isSubmitting,
    // },
    handleAction,
  };
};

export default useFormAction;
